using Microsoft.EntityFrameworkCore;
using SportHub.Data;
using SportHub.DTOs.Slots;
using SportHub.Models;
using SportHub.Repositories.Interfaces;

namespace SportHub.Repositories.Implementations
{
    public class SlotRepository : ISlotRepository
    {
        private readonly AppDbContext _context;

        public SlotRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<TimeSlotResponseDto>> GetTimeSlotByDateAsync(SlotRequestDto request)
        {
            var result = new List<TimeSlotResponseDto>();
            
            var field = await _context.Fields.FirstOrDefaultAsync(f => f.Id == request.fieldId);
            if (field == null) return result;

            var timeSlots = await _context.TimeSlots
                .Where(ts => ts.SportCenterId == null || ts.SportCenterId == field.SportCenterId)
                .OrderBy(ts => ts.StartTime)
                .ToListAsync();
            foreach (var slot in timeSlots)
            {
                var booked = await _context.BookingSlots.AnyAsync(bs =>
                    bs.SlotId == slot.Id &&
                    bs.Bookings.FieldId == request.fieldId &&
                    bs.Bookings.BookingDate == request.date &&
                    (bs.Bookings.Status == BookingStatus.Pending || bs.Bookings.Status == BookingStatus.Confirmed || bs.Bookings.Status == BookingStatus.Completed));

                result.Add(new TimeSlotResponseDto
                {
                    StartTime = slot.StartTime,
                    EndTime = slot.EndTime,
                    Status = booked ? SlotStatus.Booked : SlotStatus.Free
                });
            }

            return result;
        }

        public async Task<List<TimeSlots>> GetTimeSlotsBySportCenterAsync(Guid sportCenterId)
        {
            return await _context.TimeSlots
                .Where(ts => ts.SportCenterId == sportCenterId || ts.SportCenterId == null)
                .OrderBy(ts => ts.StartTime)
                .ToListAsync();
        }

        public async Task<TimeSlots?> GetTimeSlotByIdAsync(Guid id)
        {
            return await _context.TimeSlots.FirstOrDefaultAsync(ts => ts.Id == id);
        }

        public async Task<TimeSlots> CreateTimeSlotAsync(TimeSlots timeSlot)
        {
            _context.TimeSlots.Add(timeSlot);
            await _context.SaveChangesAsync();
            return timeSlot;
        }

        public async Task UpdateTimeSlotAsync(TimeSlots timeSlot)
        {
            _context.TimeSlots.Update(timeSlot);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteTimeSlotAsync(Guid id)
        {
            var slot = await GetTimeSlotByIdAsync(id);
            if (slot != null)
            {
                _context.TimeSlots.Remove(slot);
                await _context.SaveChangesAsync();
            }
        }
    }
}
