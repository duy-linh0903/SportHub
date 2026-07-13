namespace SportHub.DTOs.Review
{
    public class ReviewResponseDto
    {
        public int Rating { get; set; }
        public string Comment { get; set; }
        public Guid UserId { get; set; }
        public Guid SportCenterId { get; set; }
    }
}
