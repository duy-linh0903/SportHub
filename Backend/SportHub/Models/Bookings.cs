using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SportHub.Models
{
    public class Bookings
    {
        [Key]
        public Guid Id { get; set; }
        [Required]
        public Guid UserId {  get; set; }
        [ForeignKey(nameof(UserId))]
        public virtual Users User { get; set; }
        [Required]
        public Guid FieldId { get; set; }
        [ForeignKey(nameof(FieldId))]
        public virtual Fields Fields { get; set; }
        [Required]
        public DateOnly BookingDate { get; set; }

        public double TotalPrice { get; set; }
        public string Status { get; set; }
        public string CheckInCode { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}
