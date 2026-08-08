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
            var timeSlots = await _context.TimeSlots.ToListAsync();
            foreach (var slot in timeSlots)
            {
                var booked = await _context.BookingSlots.AnyAsync(bs =>
                    bs.SlotId == slot.Id &&
                    bs.Bookings.FieldId == request.fieldId &&
                    bs.Bookings.BookingDate == request.date &&
                    (bs.Bookings.Status == BookingStatus.Pending || bs.Bookings.Status == BookingStatus.Confirmed));

                result.Add(new TimeSlotResponseDto
                {
                    StartTime = slot.StartTime,
                    EndTime = slot.EndTime,
                    Status = booked ? SlotStatus.Booked : SlotStatus.Free
                });
            }

            return result;
        }
    }
}
