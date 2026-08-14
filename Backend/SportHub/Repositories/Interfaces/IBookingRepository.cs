using SportHub.Models;

namespace SportHub.Repositories.Interfaces
{
    public interface IBookingRepository
    {
        Task<List<Bookings>> GetAllAsync();
        Task<Bookings?> GetByIdAsync(Guid id);
        Task<Bookings?> GetByCheckInCodeAsync(string code);
        Task<List<TimeSlots>> GetTimeSlotsByIdsAsync(List<Guid> ids);
        Task<bool> AnySlotConflictAsync(List<Guid> slotIds, Guid fieldId, DateOnly bookingDate);
        Task<List<Guid>> GetBookedSlotIdsAsync(Guid fieldId, DateOnly bookingDate);
        Task AddAsync(Bookings addBooking);
        Task DeleteAsync(Guid id);
        Task<List<Bookings>> GetBySportCenterId(Guid centerId);
        Task<List<Bookings>> GetByUserId(Guid userId);
        Task<List<Bookings>> GetByFieldId(Guid fieldId);
        Task<List<Bookings>> GetByDateRange(DateOnly startDate, DateOnly endDate);
        Task<List<Bookings>> GetBookingsByOwnerAsync(Guid ownerId);
        Task UpdateStatusAsync(Guid bookingId, string newStatus);
        Task CreateBookingWithDetailsAsync(Bookings booking, List<BookingServices> bookingServices, List<BookingSlots> bookingSlots);
    }
}
