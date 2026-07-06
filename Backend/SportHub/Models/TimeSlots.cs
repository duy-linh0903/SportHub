using System.ComponentModel.DataAnnotations;

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
    }
}
