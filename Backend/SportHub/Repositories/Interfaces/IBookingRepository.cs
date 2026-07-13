using SportHub.Models;

namespace SportHub.Repositories.Interfaces
{
    public interface IBookingRepository
    {
        Task<List<Bookings>> GetAllAsync();
        Task<Bookings?> GetByIdAsync(Guid id);
        Task AddAsync(Bookings addBooking);
        Task DeleteAsync(Guid id);
        Task<List<Bookings>> GetBySportCenterId(Guid centerId);
        Task<List<Bookings>> GetByUserId(Guid userId);
        Task<List<Bookings>> GetByFieldId(Guid fieldId);
        Task<List<Bookings>> GetByDateRange(DateOnly startDate, DateOnly endDate);
        Task UpdateStatusAsync(Guid bookingId, string newStatus);
    }
}
