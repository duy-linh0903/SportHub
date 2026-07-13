using Microsoft.EntityFrameworkCore;
using SportHub.Data;
using SportHub.Models;
using SportHub.Repositories.Interfaces;

namespace SportHub.Repositories.Implementations
{
    public class BookingRepository : IBookingRepository
    {
        private readonly AppDbContext _context;

        public BookingRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Bookings>> GetAllAsync()
        {
            return await _context.Bookings.ToListAsync();
        }

        public async Task<Bookings?> GetByIdAsync(Guid id)
        {
            return await _context.Bookings.FirstOrDefaultAsync(b => b.Id == id);
        }

        public async Task AddAsync(Bookings addBooking)
        {
            await _context.Bookings.AddAsync(addBooking);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
            var booking = await _context.Bookings.FirstOrDefaultAsync(b => b.Id == id);
            if (booking != null)
            {
                booking.Status = "Deleted";
                await _context.SaveChangesAsync();
            }
        }

        public async Task<List<Bookings>> GetBySportCenterId(Guid centerId)
        {
            return await _context.Bookings
                .Include(b => b.Fields)
                .Where(b => b.Fields.SportCenterId == centerId)
                .ToListAsync();
        }

        public async Task<List<Bookings>> GetByUserId(Guid userId)
        {
            return await _context.Bookings
                .Where(b => b.UserId == userId)
                .ToListAsync();
        }

        public async Task<List<Bookings>> GetByFieldId(Guid fieldId)
        {
            return await _context.Bookings
                .Where(b => b.FieldId == fieldId)
                .ToListAsync();
        }

        public async Task<List<Bookings>> GetByDateRange(DateOnly startDate, DateOnly endDate)
        {
            return await _context.Bookings
                .Where(b => b.BookingDate >= startDate && b.BookingDate <= endDate)
                .ToListAsync();
        }

        public async Task UpdateStatusAsync(Guid bookingId, string newStatus)
        {
            var booking = await _context.Bookings.FirstOrDefaultAsync(b => b.Id == bookingId);
            if (booking != null)
            {
                booking.Status = newStatus;
                await _context.SaveChangesAsync();
            }
        }
    }
}
