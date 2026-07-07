using SportHub.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SportHub.DTOs.Review
{
    public class CreateReviewDto
    {
        [Required]
        public Guid FieldId { get; set; }
        [Required]
        public Guid BookingId { get; set; }
        [Required, Range(1, 5)]
        public int Rating { get; set; }
        public string? Comment { get; set; }
    }
}
