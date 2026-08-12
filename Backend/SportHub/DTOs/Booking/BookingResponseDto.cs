using SportHub.Models;

namespace SportHub.DTOs.Booking
{
    public class BookingResponseDto
    {
        public Guid BookingId { get; set; }
        public Guid UserId { get; set; }
        public Guid FieldId { get; set; }
        public DateOnly BookingDate { get; set; }
        public BookingStatus Status { get; set; }
        public double TotalPrice { get; set; }
        public string? CheckInCode { get; set; }
        public DateTime CreatedAt { get; set; }

        public string FieldName { get; set; } = string.Empty;
        public string FieldType { get; set; } = string.Empty;
        public Guid SportCenterId { get; set; }
        public string SportCenterName { get; set; } = string.Empty;
        public string SportCenterAddress { get; set; } = string.Empty;
        public string TimeSlots { get; set; } = string.Empty;
    }
}
