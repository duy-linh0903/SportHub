namespace SportHub.DTOs.Review
{
    public class ReviewResponseDto
    {
        public int Rating { get; set; }
        public string Comment { get; set; }
        public Guid UserId { get; set; }
        public string? UserName { get; set; }
        public Guid SportCenterId { get; set; }
        public string? SportCenterName { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
