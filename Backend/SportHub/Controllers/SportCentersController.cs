using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SportHub.DTOs.SportCenter;
using SportHub.Services.Interfaces;

namespace SportHub.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SportCentersController : ControllerBase
    {
        private readonly ISportCenterService _sportCenterService;

        public SportCentersController(ISportCenterService sportCenterService)
        {
            _sportCenterService = sportCenterService;
        }

        [HttpGet]
        public async Task<ActionResult<List<SportCenterResponseDto>>> GetAll()
        {
            return Ok(await _sportCenterService.GetAllSportCentersAsync());
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<SportCenterResponseDto>> GetById(Guid id)
        {
            var result = await _sportCenterService.GetSportCenterByIdAsync(id);
            if (result == null)
            {
                return NotFound();
            }
            return Ok(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<SportCenterResponseDto>> Create([FromBody] CreateSportCenterDto dto)
        {
            var result = await _sportCenterService.CreateSportCenterAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = result.SportCenterId }, result);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id:guid}")]
        public async Task<ActionResult<SportCenterResponseDto>> Update(Guid id, [FromBody] UpdateSportCenterDto dto)
        {
            var ownerId = GetCurrentUserId();
            if (!ownerId.HasValue) return Unauthorized();

            var sportCenter = await _sportCenterService.GetSportCenterByIdAsync(id);
            if (sportCenter == null) return NotFound();
            
            // Check if current Admin is the Owner
            if (sportCenter.OwnerId != ownerId.Value) return Forbid();

            var result = await _sportCenterService.UpdateSportCenterAsync(id, dto);
            return Ok(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var ownerId = GetCurrentUserId();
            if (!ownerId.HasValue) return Unauthorized();

            var sportCenter = await _sportCenterService.GetSportCenterByIdAsync(id);
            if (sportCenter == null) return NotFound();
            
            if (sportCenter.OwnerId != ownerId.Value) return Forbid();

            await _sportCenterService.DeleteSportCenterAsync(id);
            return NoContent();
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id:guid}/restore")]
        public async Task<IActionResult> Restore(Guid id)
        {
            var ownerId = GetCurrentUserId();
            if (!ownerId.HasValue) return Unauthorized();

            var sportCenter = await _sportCenterService.GetSportCenterByIdAsync(id);
            if (sportCenter == null) return NotFound();
            
            if (sportCenter.OwnerId != ownerId.Value) return Forbid();

            await _sportCenterService.RestoreSportCenterAsync(id);
            return NoContent();
        }

        [HttpGet("owner")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetSportCentersByOwner()
        {
            var ownerIdString = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(ownerIdString) || !Guid.TryParse(ownerIdString, out Guid ownerId))
            {
                return Unauthorized("Invalid user ID");
            }

            var result = await _sportCenterService.GetSportCentersByOwnerIdAsync(ownerId);
            return Ok(result);
        }

        [HttpGet("search")]
        public async Task<ActionResult<List<SportCenterResponseDto>>> Search([FromQuery] string name)
        {
            return Ok(await _sportCenterService.SearchSportCentersAsync(name));
        }

        private Guid? GetCurrentUserId()
        {
            var userIdString = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (Guid.TryParse(userIdString, out Guid userId))
            {
                return userId;
            }
            return null;
        }
    }
}
