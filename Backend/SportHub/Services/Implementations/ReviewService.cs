using SportHub.DTOs.Review;
using SportHub.Models;
using SportHub.Repositories.Interfaces;
using SportHub.Services.Interfaces;

namespace SportHub.Services.Implementations
{
    public class ReviewService : IReviewService
    {
        private readonly IReviewRepository _reviewRepository;
        public ReviewService(IReviewRepository reviewRepository)
        {
            _reviewRepository = reviewRepository;
        }

        public async Task<List<ReviewResponseDto>> GetReviewsBySportCenterAsync(Guid sportCenterId)
        {
            var reviewList = await _reviewRepository.GetBySportCenterIdAsync(sportCenterId);
            var result = new List<ReviewResponseDto>();
            foreach (var review in reviewList)
            {
                result.Add(new ReviewResponseDto
                {
                    Rating = review.Rating,
                    Comment = review.Comment,
                    UserId = review.UserId,
                    SportCenterId = sportCenterId
                });
            }
            return result;
        }

        public async Task<ReviewResponseDto> CreateReviewAsync(CreateReviewDto reviewDto, Guid userId)
        {
            var review = new Reviews
            {
                Rating = reviewDto.Rating,
                Comment = reviewDto.Comment,
                UserId = reviewDto.UserId,
                SportCenterId = reviewDto.SportCenterId,
                BookingId = reviewDto.BookingId
            };
            await _reviewRepository.AddAsync(review);
            return new ReviewResponseDto
            {
                Rating = review.Rating,
                Comment = review.Comment,
                UserId = review.UserId,
                SportCenterId = review.SportCenterId
            };
        }
    }
}
