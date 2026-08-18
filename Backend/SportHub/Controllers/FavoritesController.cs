using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SportHub.DTOs.SportCenter;
using SportHub.Services.Interfaces;

namespace SportHub.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class FavoritesController : ControllerBase
    {
        private readonly IFavoriteService _favoriteService;

        public FavoritesController(IFavoriteService favoriteService)
        {
            _favoriteService = favoriteService;
        }

        private Guid? GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrWhiteSpace(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            {
                return null;
            }
            return userId;
        }

        [HttpPost("toggle/{sportCenterId:guid}")]
        public async Task<IActionResult> ToggleFavorite(Guid sportCenterId)
        {
            var userId = GetCurrentUserId();
            if (!userId.HasValue) return Unauthorized();

            await _favoriteService.ToggleFavoriteAsync(userId.Value, sportCenterId);
            return Ok(new { success = true });
        }

        [HttpGet("check/{sportCenterId:guid}")]
        public async Task<IActionResult> CheckIsFavorite(Guid sportCenterId)
        {
            var userId = GetCurrentUserId();
            if (!userId.HasValue) return Ok(false);

            var isFavorite = await _favoriteService.CheckIsFavoriteAsync(userId.Value, sportCenterId);
            return Ok(isFavorite);
        }

        [HttpGet("my-favorites")]
        public async Task<ActionResult<List<SportCenterResponseDto>>> GetMyFavorites()
        {
            var userId = GetCurrentUserId();
            if (!userId.HasValue) return Unauthorized();

            var favorites = await _favoriteService.GetFavoriteCentersAsync(userId.Value);
            return Ok(favorites);
        }
    }
}
