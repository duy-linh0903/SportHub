namespace SportHub.DTOs.Booking
{
    public class BookingResponseDto
    {
        public Guid BookingId { get; set; }
        public Guid UserId { get; set; }
        public Guid FieldId { get; set; }
        public DateOnly BookingDate { get; set; }
        public string Status { get; set; } = string.Empty;
        public decimal TotalPrice { get; set; }
        public string? CheckInCode { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
