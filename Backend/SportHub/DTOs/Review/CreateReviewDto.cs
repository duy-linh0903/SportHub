using System.ComponentModel.DataAnnotations;

namespace SportHub.DTOs.Review
{
    public class CreateReviewDto
    {
        [Required]
        public Guid SportCenterId { get; set; }
        [Required]
        public Guid BookingId { get; set; }
        [Required, Range(1, 5)]
        public int Rating { get; set; }
        public string? Comment { get; set; }
    }
}
