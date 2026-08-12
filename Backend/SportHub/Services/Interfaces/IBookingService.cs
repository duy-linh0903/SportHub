using SportHub.DTOs.Booking;
using SportHub.Models;

namespace SportHub.Services.Interfaces
{
    public interface IBookingService
    {
        Task<List<BookingResponseDto>> GetAllBookingsAsync();
        Task<BookingResponseDto?> GetBookingByIdAsync(Guid id);
        Task<BookingResponseDto> CreateBookingAsync(CreateBookingDto bookingDto, Guid userId);
        Task UpdateBookingStatusAsync(Guid bookingId,BookingStatus  status);
        Task CancelBookingAsync(Guid bookingId);
        Task<List<BookingResponseDto>> GetBookingsByUserAsync(Guid userId);
        Task<List<BookingResponseDto>> GetBookingsByFieldAsync(Guid fieldId);
        Task<List<BookingResponseDto>> GetBookingsBySportCenterAsync(Guid sportCenterId);
        Task<List<BookingResponseDto>> GetBookingsByDateRangeAsync(DateOnly startDate, DateOnly endDate);
        Task<List<Guid>> GetBookedSlotIdsAsync(Guid fieldId, DateOnly date);
    }
}
