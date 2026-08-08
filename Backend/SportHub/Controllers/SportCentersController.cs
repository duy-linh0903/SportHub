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
            var result = await _sportCenterService.UpdateSportCenterAsync(id, dto);
            if (result == null)
            {
                return NotFound();
            }
            return Ok(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _sportCenterService.DeleteSportCenterAsync(id);
            return NoContent();
        }

        [HttpGet("search")]
        public async Task<ActionResult<List<SportCenterResponseDto>>> Search([FromQuery] string name)
        {
            return Ok(await _sportCenterService.SearchSportCentersAsync(name));
        }
    }
}
