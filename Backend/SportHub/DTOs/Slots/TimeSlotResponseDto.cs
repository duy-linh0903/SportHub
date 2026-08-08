using System;

namespace SportHub.DTOs.Slots
{
    public class TimeSlotResponseDto
    {
        public TimeOnly StartTime { get; set; }
        public TimeOnly EndTime { get; set; }
        public SlotStatus Status { get; set; }
    }

    public enum SlotStatus
    {
        Free = 0,
        Booked = 1
    }
}
