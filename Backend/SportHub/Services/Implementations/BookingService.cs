using System.Linq;
using SportHub.DTOs.Booking;
using SportHub.Models;
using SportHub.Repositories.Interfaces;
using SportHub.Services.Interfaces;
using Microsoft.AspNetCore.SignalR;
using SportHub.Hubs;

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
                throw new KeyNotFoundException("Booking isn't found");
            }
            return BookingServiceDto(booking);
        }

        public async Task<BookingResponseDto> CreateBookingAsync(CreateBookingDto bookingDto, Guid userId)
        {
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

            string title = "Đặt sân thành công";
            string body = $"Bạn đã đặt sân thành công. Mã Check-in của bạn là: {booking.CheckInCode}";
            await _hubContext.Clients.Group(userId.ToString()).SendAsync("ReceiveNotification", title, body, booking.Id);

            return BookingServiceDto(booking);
        }

        public async Task UpdateBookingStatusAsync(Guid bookingId, BookingStatus status)
        {
            var booking = await _bookingRepository.GetByIdAsync(bookingId);
            if (booking == null)
            {
                throw new KeyNotFoundException("Booking isn't found");
            }

            await _bookingRepository.UpdateStatusAsync(bookingId, status.ToString());

            string title = status == BookingStatus.Cancelled ? "Lịch đặt bị hủy" : 
                           status == BookingStatus.Confirmed ? "Lịch đặt đã xác nhận" : "Cập nhật lịch đặt";
            string body = $"Lịch đặt sân của bạn đã được chuyển sang trạng thái: {status}";
            
            await _hubContext.Clients.Group(booking.UserId.ToString()).SendAsync("ReceiveNotification", title, body, bookingId);
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
            string timeSlotsStr = string.Empty;
            if (booking.BookingSlots != null && booking.BookingSlots.Any())
            {
                var times = booking.BookingSlots
                    .Where(bs => bs.TimeSlots != null)
                    .OrderBy(bs => bs.TimeSlots.StartTime)
                    .Select(bs => $"{bs.TimeSlots.StartTime.ToString("HH:mm")} - {bs.TimeSlots.EndTime.ToString("HH:mm")}");
                timeSlotsStr = string.Join(", ", times);
            }

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
                TimeSlots = timeSlotsStr
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
