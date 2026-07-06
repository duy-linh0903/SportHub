using System.ComponentModel.DataAnnotations.Schema;

namespace SportHub.Models
{
    public class BookingSlots
    {
        public Guid BookingId { get; set; }
        [ForeignKey(nameof(BookingId))]
        public virtual Bookings Bookings { get; set; }
        public Guid SlotId { get; set; }
        [ForeignKey(nameof(SlotId))]
        public virtual TimeSlots TimeSlots { get; set; }
    }
}
