using System.ComponentModel.DataAnnotations;

namespace SportHub.DTOs.Service
{
    public class BookingServiceRequestDto
    {
        [Required]
        public Guid ServiceId { get; set; }
        [Required, Range(1, int.MaxValue)]
        public int Quantity { get; set; }
    }
}
