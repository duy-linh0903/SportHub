using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SportHub.Models
{
    public class Reviews
    {
        [Key]
        public Guid Id {  get; set; }
        [Required]
        public Guid UserId {  get; set; }
        [ForeignKey(nameof(UserId))]
        public virtual Users Users { get; set; }
        [Required]
        public Guid SportCenterId { get; set; }
        [ForeignKey(nameof(SportCenterId))]
        public virtual SportCenters  SportCenters {  get; set; }
        [Required]
        public Guid BookingId {  get; set; }
        [ForeignKey(nameof(BookingId))]
        public virtual Bookings Bookings { get; set; }
        [Required, Range(0,5)]
        public int Rating { get; set; }
        [Required]
        public string Comment { get; set; }
        public DateTime CreatedAt { get; set; }
        public Reviews()
        {
            Id = Guid.NewGuid();
            CreatedAt = DateTime.UtcNow;
        }
    }
}
