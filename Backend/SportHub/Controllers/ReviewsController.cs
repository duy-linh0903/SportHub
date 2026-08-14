using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SportHub.DTOs.Review;
using SportHub.Services.Interfaces;
using System.Security.Claims;

namespace SportHub.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewsController : ControllerBase
    {
        private readonly IReviewService _reviewService;

        public ReviewsController(IReviewService reviewService)
        {
            _reviewService = reviewService;
        }

        [HttpGet("sportcenter/{sportCenterId:guid}")]
        public async Task<ActionResult<List<ReviewResponseDto>>> GetBySportCenter(Guid sportCenterId)
        {
            return Ok(await _reviewService.GetReviewsBySportCenterAsync(sportCenterId));
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("owner")]
        public async Task<ActionResult<List<ReviewResponseDto>>> GetByOwner()
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var ownerId))
            {
                return Unauthorized(new { message = "Không tìm thấy thông tin Owner" });
            }

            return Ok(await _reviewService.GetReviewsByOwnerAsync(ownerId));
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<ReviewResponseDto>> Create([FromBody] CreateReviewDto dto)
        {
            try
            {
                var result = await _reviewService.CreateReviewAsync(dto, dto.UserId);
                return Created(string.Empty, result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
