using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SportHub.DTOs.Review;
using SportHub.Services.Interfaces;

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

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<ReviewResponseDto>> Create([FromBody] CreateReviewDto dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrWhiteSpace(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            {
                return Forbid();
            }

            try
            {
                var result = await _reviewService.CreateReviewAsync(dto, userId);
                return Created(string.Empty, result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
