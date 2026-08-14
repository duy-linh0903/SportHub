using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SportHub.DTOs.User;
using SportHub.Services.Interfaces;
using System.Security.Claims;

namespace SportHub.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<ActionResult<List<UserResponseDto>>> GetAll()
        {
            var users = await _userService.GetAllUsersAsync();
            return Ok(users);
        }

        [Authorize]
        [HttpGet("{id:guid}")]
        public async Task<ActionResult<UserResponseDto>> GetById(Guid id)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            {
                return Forbid();
            }

            if (!User.IsInRole("Admin") && userId != id)
            {
                return Forbid();
            }

            var user = await _userService.GetUserByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("by-email")]
        public async Task<ActionResult<UserResponseDto>> GetByEmail([FromQuery] string email)
        {
            var user = await _userService.GetUserByEmailAsync(email);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }

        [Authorize]
        [HttpPut("{id:guid}")]
        public async Task<ActionResult<UserResponseDto>> Update(Guid id, [FromBody] UpdateProfileDto dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            {
                return Forbid();
            }

            if (!User.IsInRole("Admin") && userId != id)
            {
                return Forbid();
            }

            var updatedUser = await _userService.UpdateUserAsync(id, dto);
            if (updatedUser == null)
            {
                return NotFound();
            }

            return Ok(updatedUser);
        }

        [Authorize]
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            {
                return Forbid();
            }

            if (!User.IsInRole("Admin") && userId != id)
            {
                return Forbid();
            }

            await _userService.DeleteUserAsync(id);
            return NoContent();
        }
    }
}
