using SportHub.DTOs.Review;

namespace SportHub.Services.Interfaces
{
    public interface IReviewService
    {
        Task<List<ReviewResponseDto>> GetReviewsBySportCenterAsync(Guid sportCenterId);
        Task<ReviewResponseDto> CreateReviewAsync(CreateReviewDto reviewDto, Guid userId);
    }
}
