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
            return await _context.Bookings
                .Include(b => b.Fields)
                    .ThenInclude(f => f.SportCenter)
                .Include(b => b.BookingSlots)
                    .ThenInclude(bs => bs.TimeSlots)
                .ToListAsync();
        }

        public async Task<Bookings?> GetByIdAsync(Guid id)
        {
            return await _context.Bookings
                .Include(b => b.Fields)
                    .ThenInclude(f => f.SportCenter)
                .Include(b => b.BookingSlots)
                    .ThenInclude(bs => bs.TimeSlots)
                .FirstOrDefaultAsync(b => b.Id == id);
        }

        public async Task<Bookings?> GetByCheckInCodeAsync(string code)
        {
            return await _context.Bookings
                .Include(b => b.Fields)
                    .ThenInclude(f => f.SportCenter)
                .Include(b => b.BookingSlots)
                    .ThenInclude(bs => bs.TimeSlots)
                .FirstOrDefaultAsync(b => b.CheckInCode == code);
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
                booking.Status = BookingStatus.Deleted;
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
                .Include(b => b.Fields)
                    .ThenInclude(f => f.SportCenter)
                .Include(b => b.BookingSlots)
                    .ThenInclude(bs => bs.TimeSlots)
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

        public async Task<List<Bookings>> GetBookingsByOwnerAsync(Guid ownerId)
        {
            return await _context.Bookings
                .Include(b => b.Fields)
                    .ThenInclude(f => f.SportCenter)
                .Include(b => b.BookingSlots)
                    .ThenInclude(bs => bs.TimeSlots)
                .Where(b => b.Fields.SportCenter.OwnerId == ownerId)
                .ToListAsync();
        }

        public async Task UpdateStatusAsync(Guid bookingId, string newStatus)
        {
            var booking = await _context.Bookings.FirstOrDefaultAsync(b => b.Id == bookingId);
            if (booking != null)
            {
                if (Enum.TryParse<BookingStatus>(newStatus, true, out var parsedStatus))
                {
                    booking.Status = parsedStatus;
                    await _context.SaveChangesAsync();
                }
            }
        }

        public async Task<List<TimeSlots>> GetTimeSlotsByIdsAsync(List<Guid> ids)
        {
            return await _context.TimeSlots.Where(ts => ids.Contains(ts.Id)).ToListAsync();
        }

        public async Task<bool> AnySlotConflictAsync(List<Guid> slotIds, Guid fieldId, DateOnly bookingDate)
        {
            return await _context.BookingSlots.AnyAsync(bs =>
                slotIds.Contains(bs.SlotId) &&
                bs.Bookings.FieldId == fieldId &&
                bs.Bookings.BookingDate == bookingDate &&
                (bs.Bookings.Status == BookingStatus.Pending || bs.Bookings.Status == BookingStatus.Confirmed || bs.Bookings.Status == BookingStatus.Completed));
        }

        public async Task CreateBookingWithDetailsAsync(Bookings booking, List<BookingServices> bookingServices, List<BookingSlots> bookingSlots)
        {
            await using var trx = await _context.Database.BeginTransactionAsync(System.Data.IsolationLevel.Serializable);
            try
            {
                var slotIds = bookingSlots.Select(bs => bs.SlotId).ToList();
                var conflictExists = await _context.BookingSlots.AnyAsync(bs =>
                    slotIds.Contains(bs.SlotId) &&
                    bs.Bookings.FieldId == booking.FieldId &&
                    bs.Bookings.BookingDate == booking.BookingDate &&
                    (bs.Bookings.Status == BookingStatus.Pending || bs.Bookings.Status == BookingStatus.Confirmed || bs.Bookings.Status == BookingStatus.Completed));

                if (conflictExists)
                {
                    throw new InvalidOperationException("One or more selected slots are already booked for the requested field and date.");
                }

                await _context.Bookings.AddAsync(booking);
                if (bookingServices != null && bookingServices.Any())
                {
                    await _context.BookingServices.AddRangeAsync(bookingServices);
                }
                if (bookingSlots != null && bookingSlots.Any())
                {
                    await _context.BookingSlots.AddRangeAsync(bookingSlots);
                }

                await _context.SaveChangesAsync();
                await trx.CommitAsync();
            }
            catch
            {
                await trx.RollbackAsync();
                throw;
            }
        }

        public async Task<List<Guid>> GetBookedSlotIdsAsync(Guid fieldId, DateOnly date)
        {
            return await _context.BookingSlots
                .Where(bs =>
                    bs.Bookings.FieldId == fieldId &&
                    bs.Bookings.BookingDate == date &&
                    (bs.Bookings.Status == BookingStatus.Pending || bs.Bookings.Status == BookingStatus.Confirmed || bs.Bookings.Status == BookingStatus.Completed))
                .Select(bs => bs.SlotId)
                .ToListAsync();
        }
    }
}
