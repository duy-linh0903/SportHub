using SportHub.DTOs.Service;
using System.ComponentModel.DataAnnotations;

namespace SportHub.DTOs.Booking
{
    public class CreateBookingDto
    {
        [Required]
        public Guid FieldId { get; set; }
        [Required]
        public DateOnly BookingDate { get; set; }
        [MinLength(1)]
        public List<Guid> SlotIds { get; set; } = new List<Guid>();
        public List<BookingServiceRequestDto> Services { get; set; } = new List<BookingServiceRequestDto>();
    }
}
