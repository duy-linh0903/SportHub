using SportHub.Models;
using System.ComponentModel.DataAnnotations;

namespace SportHub.DTOs.Booking
{
    public class UpdateBookingStatusDto
    {
        [Required]
        public BookingStatus Status { get; set; }

    }
}
