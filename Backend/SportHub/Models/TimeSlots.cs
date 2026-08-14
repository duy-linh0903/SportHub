using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SportHub.Models
{
    public class TimeSlots
    {
        [Key]
        public Guid Id { get; set; }
        [Required]
        public TimeOnly StartTime { get; set; }
        [Required]
        public TimeOnly EndTime { get; set; }

        public Guid? SportCenterId { get; set; }
        [ForeignKey(nameof(SportCenterId))]
        public virtual SportCenters? SportCenter { get; set; }

        public TimeSlots()
        {
            Id = Guid.NewGuid();
        }
    }
}
