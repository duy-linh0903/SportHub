using System.Linq;
using Microsoft.AspNetCore.SignalR;
using SportHub.DTOs.Booking;
using SportHub.DTOs.Service;
using SportHub.Hubs;
using SportHub.Models;
using SportHub.Repositories.Interfaces;
using SportHub.Services.Interfaces;

namespace SportHub.Services.Implementations
{
    public class BookingService : IBookingService
    {
        private readonly IBookingRepository _bookingRepository;
        private readonly IFieldRepository _fieldRepository;
        private readonly IServiceRepository _serviceRepository;
        private readonly IUserRepository _userRepository;
        private readonly IHubContext<NotificationHub> _hubContext;

        public BookingService(
            IBookingRepository bookingRepository,
            IFieldRepository fieldRepository,
            IServiceRepository serviceRepository,
            IUserRepository userRepository,
            IHubContext<NotificationHub> hubContext)
        {
            _bookingRepository = bookingRepository;
            _fieldRepository = fieldRepository;
            _serviceRepository = serviceRepository;
            _userRepository = userRepository;
            _hubContext = hubContext;
        }

        public async Task<List<BookingResponseDto>> GetAllBookingsAsync()
        {
            var bookingList = await _bookingRepository.GetAllAsync();
            return BookingServiceListDto(bookingList);
        }

        public async Task<BookingResponseDto?> GetBookingByIdAsync(Guid id)
        {
            var booking = await _bookingRepository.GetByIdAsync(id);
            if (booking == null)
            {
                return null;
            }
            return BookingServiceDto(booking);
        }

        public async Task<BookingResponseDto?> GetBookingByCheckInCodeAsync(string code)
        {
            var booking = await _bookingRepository.GetByCheckInCodeAsync(code);
            if (booking == null)
            {
                throw new KeyNotFoundException("Booking isn't found");
            }
            return BookingServiceDto(booking);
        }

        public async Task<BookingResponseDto> CreateBookingAsync(CreateBookingDto bookingDto, Guid userId)
        {
            if (bookingDto == null)
            {
                throw new ArgumentNullException(nameof(bookingDto));
            }

            bookingDto.ServiceList ??= new List<BookingServiceRequestDto>();

            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
            {
                throw new KeyNotFoundException("User isn't found");
            }
            if (user.Status != UserStatus.Active)
            {
                throw new InvalidOperationException("User is not allowed to create a booking.");
            }

            var field = await _fieldRepository.GetByIdAsync(bookingDto.FieldId);
            if (field == null)
            {
                throw new KeyNotFoundException("Field isn't found");
            }
            if (field.Status != FieldStatus.Active)
            {
                throw new InvalidOperationException("Field is not available for booking.");
            }

            if (bookingDto.SlotIds == null || !bookingDto.SlotIds.Any())
            {
                throw new ArgumentException("At least one time slot must be selected.");
            }

            var slotIds = bookingDto.SlotIds.Distinct().ToList();
            var timeSlots = await _bookingRepository.GetTimeSlotsByIdsAsync(slotIds);

            if (timeSlots.Count != slotIds.Count)
            {
                throw new KeyNotFoundException("One or more selected time slots are invalid.");
            }

            var conflictExists = await _bookingRepository.AnySlotConflictAsync(slotIds, bookingDto.FieldId, bookingDto.BookingDate);

            if (conflictExists)
            {
                throw new InvalidOperationException("One or more selected slots are already booked for the requested field and date.");
            }

            var booking = new Bookings
            {
                UserId = userId,
                FieldId = bookingDto.FieldId,
                BookingDate = bookingDto.BookingDate,
                TotalPrice = 0,
                Status = BookingStatus.Pending,
                CreatedAt = DateTime.Now,
                CheckInCode = GenerateCheckInCode()
            };

            double totalPrice = field.PricePerSlot * slotIds.Count;
            var bookingServices = new List<BookingServices>();

            foreach (var serviceRequest in bookingDto.ServiceList)
            {
                var serviceItem = await _serviceRepository.GetByIdAsync(serviceRequest.ServiceId);
                if (serviceItem == null)
                {
                    throw new KeyNotFoundException($"Service with id {serviceRequest.ServiceId} isn't found");
                }
                if (serviceItem.Status != ServiceStatus.Active)
                {
                    throw new InvalidOperationException($"Service '{serviceItem.Name}' is not available.");
                }
                if (serviceRequest.Quantity <= 0)
                {
                    throw new ArgumentException("Service quantity must be greater than zero.");
                }

                var serviceTotal = serviceItem.Price * serviceRequest.Quantity;
                totalPrice += serviceTotal;
                bookingServices.Add(new BookingServices
                {
                    BookingId = booking.Id,
                    ServiceId = serviceRequest.ServiceId,
                    Quantity = serviceRequest.Quantity,
                    Price = serviceTotal
                });
            }

            var bookingSlots = slotIds.Select(slotId => new BookingSlots
            {
                BookingId = booking.Id,
                SlotId = slotId
            }).ToList();

            booking.TotalPrice = totalPrice;

            await _bookingRepository.CreateBookingWithDetailsAsync(booking, bookingServices, bookingSlots);

            // Send real-time notification to user
            try
            {
                await _hubContext.Clients.Group(userId.ToString())
                    .SendAsync("ReceiveNotification",
                        "Đặt sân thành công!",
                        $"Bạn đã đặt sân {field.Name} ngày {bookingDto.BookingDate}. Mã check-in: {booking.CheckInCode}",
                        booking.Id.ToString());
            }
            catch (Exception) { /* Don't fail booking if notification fails */ }

            return BookingServiceDto(booking);
        }

        public async Task<List<BookingResponseDto>> GetBookingsByOwnerAsync(Guid ownerId)
        {
            var bookings = await _bookingRepository.GetBookingsByOwnerAsync(ownerId);
            return BookingServiceListDto(bookings);
        }

        public async Task UpdateBookingStatusAsync(Guid bookingId, BookingStatus status)
        {
            var booking = await _bookingRepository.GetByIdAsync(bookingId);
            if (booking == null)
            {
                throw new KeyNotFoundException("Booking isn't found");
            }

            var validTransitions = new Dictionary<BookingStatus, BookingStatus[]>
            {
                [BookingStatus.Pending] = new[] { BookingStatus.Confirmed, BookingStatus.Cancelled },
                [BookingStatus.Confirmed] = new[] { BookingStatus.Completed, BookingStatus.Cancelled },
                [BookingStatus.Completed] = Array.Empty<BookingStatus>(),
                [BookingStatus.Cancelled] = Array.Empty<BookingStatus>(),
                [BookingStatus.Deleted] = Array.Empty<BookingStatus>()
            };

            if (!validTransitions.TryGetValue(booking.Status, out var allowedStatuses) || !allowedStatuses.Contains(status))
            {
                throw new InvalidOperationException($"Booking status cannot change from {booking.Status} to {status}.");
            }

            await _bookingRepository.UpdateStatusAsync(bookingId, status.ToString());

            // Send real-time notification to user about status change
            try
            {
                var statusText = status switch
                {
                    BookingStatus.Confirmed => "đã được xác nhận",
                    BookingStatus.Cancelled => "đã bị hủy",
                    BookingStatus.Completed => "đã hoàn thành",
                    _ => status.ToString()
                };
                await _hubContext.Clients.Group(booking.UserId.ToString())
                    .SendAsync("ReceiveNotification",
                        "Cập nhật đặt sân",
                        $"Đơn đặt sân của bạn {statusText}.",
                        bookingId.ToString());
            }
            catch (Exception) { /* Don't fail status update if notification fails */ }
        }

        public async Task CancelBookingAsync(Guid bookingId)
        {
            await UpdateBookingStatusAsync(bookingId, BookingStatus.Cancelled);
        }

        public async Task<List<BookingResponseDto>> GetBookingsByUserAsync(Guid userId)
        {
            var bookingList = await _bookingRepository.GetByUserId(userId);
            return BookingServiceListDto(bookingList);
        }

        public async Task<List<BookingResponseDto>> GetBookingsByFieldAsync(Guid fieldId)
        {
            var bookingList = await _bookingRepository.GetByFieldId(fieldId);
            return BookingServiceListDto(bookingList);
        }

        public async Task<List<BookingResponseDto>> GetBookingsBySportCenterAsync(Guid sportCenterId)
        {
            var bookingList = await _bookingRepository.GetBySportCenterId(sportCenterId);
            return BookingServiceListDto(bookingList);
        }

        public async Task<List<BookingResponseDto>> GetBookingsByDateRangeAsync(DateOnly startDate, DateOnly endDate)
        {
            var bookingList = await _bookingRepository.GetByDateRange(startDate, endDate);
            return BookingServiceListDto(bookingList);
        }

        public async Task<List<Guid>> GetBookedSlotIdsAsync(Guid fieldId, DateOnly date)
        {
            return await _bookingRepository.GetBookedSlotIdsAsync(fieldId, date);
        }

        private static string GenerateCheckInCode()
        {
            return Guid.NewGuid().ToString("N").Substring(0, 8).ToUpperInvariant();
        }

        public BookingResponseDto BookingServiceDto(Bookings booking)
        {
            return new BookingResponseDto
            {
                BookingId = booking.Id,
                UserId = booking.UserId,
                FieldId = booking.FieldId,
                BookingDate = booking.BookingDate,
                Status = booking.Status,
                TotalPrice = booking.TotalPrice,
                CheckInCode = booking.CheckInCode,
                CreatedAt = booking.CreatedAt,
                FieldName = booking.Fields?.Name ?? string.Empty,
                FieldType = booking.Fields?.Type ?? string.Empty,
                SportCenterId = booking.Fields?.SportCenterId ?? Guid.Empty,
                SportCenterName = booking.Fields?.SportCenter?.Name ?? string.Empty,
                SportCenterAddress = booking.Fields?.SportCenter?.Address ?? string.Empty,
                TimeSlots = booking.BookingSlots != null && booking.BookingSlots.Any()
                    ? string.Join(", ", booking.BookingSlots.Where(bs => bs.TimeSlots != null).Select(bs => $"{bs.TimeSlots.StartTime:hh\\:mm}-{bs.TimeSlots.EndTime:hh\\:mm}"))
                    : string.Empty
            };
        }

        public List<BookingResponseDto> BookingServiceListDto(List<Bookings> bookingList)
        {
            var result = new List<BookingResponseDto>();
            foreach (var booking in bookingList)
            {
                result.Add(BookingServiceDto(booking));
            }
            return result;
        }
    }
}
