using SportHub.DTOs.Review;

namespace SportHub.Services.Interfaces
{
    public interface IReviewService
    {
        Task<List<ReviewResponseDto>> GetReviewsBySportCenterAsync(Guid sportCenterId);
        Task<List<ReviewResponseDto>> GetReviewsByOwnerAsync(Guid ownerId);
        Task<ReviewResponseDto> CreateReviewAsync(CreateReviewDto reviewDto, Guid userId);
    }
}
