using SportHub.DTOs.Review;
using SportHub.Models;
using SportHub.Repositories.Interfaces;
using SportHub.Services.Interfaces;

namespace SportHub.Services.Implementations
{
    public class ReviewService : IReviewService
    {
        private readonly IReviewRepository _reviewRepository;
        private readonly IBookingRepository _bookingRepository;
        public ReviewService(IReviewRepository reviewRepository, IBookingRepository bookingRepository)
        {
            _reviewRepository = reviewRepository;
            _bookingRepository = bookingRepository;
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
            var booking = await _bookingRepository.GetByIdAsync(reviewDto.BookingId);
            if (booking == null)
                throw new Exception("Booking không tồn tại.");

            if (booking.UserId != userId)
                throw new Exception("Bạn không có quyền đánh giá Booking này.");

            if (booking.Status != BookingStatus.Completed)
                throw new Exception("Chỉ có thể đánh giá sân sau khi đã sử dụng thành công (Check-in).");

            var review = new Reviews
            {
                Rating = reviewDto.Rating,
                Comment = reviewDto.Comment,
                UserId = userId,
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
