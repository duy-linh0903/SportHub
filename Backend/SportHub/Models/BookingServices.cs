using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SportHub.Models
{
    public class BookingServices
    {
        [Key]
        public Guid Id {  get; set; }
        [Required]
        public Guid BookingId {  get; set; }
        [ForeignKey(nameof(BookingId))]
        public virtual Bookings Bookings { get; set; }
        [Required]
        public Guid ServiceId { get; set; }
        [ForeignKey(nameof(ServiceId))]
        public virtual Services Services { get; set; }
        [Required, Range(0, int.MaxValue)]
        public int Quantity { get; set; }
        [Required,Range(0,double.MaxValue)]
        public double Price { get; set; }
    }
}
