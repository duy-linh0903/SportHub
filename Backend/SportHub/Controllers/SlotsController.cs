using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SportHub.Models;
using SportHub.Repositories.Interfaces;

namespace SportHub.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class SlotsController : ControllerBase
    {
        private readonly ISlotRepository _slotRepository;

        public SlotsController(ISlotRepository slotRepository)
        {
            _slotRepository = slotRepository;
        }

        [AllowAnonymous]
        [HttpGet("sportcenter/{sportCenterId:guid}")]
        public async Task<IActionResult> GetBySportCenter(Guid sportCenterId)
        {
            var slots = await _slotRepository.GetTimeSlotsBySportCenterAsync(sportCenterId);
            return Ok(slots);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] TimeSlots timeSlot)
        {
            var created = await _slotRepository.CreateTimeSlotAsync(timeSlot);
            return Ok(created);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] TimeSlots timeSlot)
        {
            if (id != timeSlot.Id) return BadRequest();
            await _slotRepository.UpdateTimeSlotAsync(timeSlot);
            return NoContent();
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _slotRepository.DeleteTimeSlotAsync(id);
            return NoContent();
        }
    }
}
