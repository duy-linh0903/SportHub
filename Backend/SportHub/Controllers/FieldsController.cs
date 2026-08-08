using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SportHub.DTOs.Field;
using SportHub.Services.Interfaces;

namespace SportHub.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FieldsController : ControllerBase
    {
        private readonly IFieldService _fieldService;

        public FieldsController(IFieldService fieldService)
        {
            _fieldService = fieldService;
        }

        [HttpGet]
        public async Task<ActionResult<List<FieldResponseDto>>> GetAll()
        {
            return Ok(await _fieldService.GetAllFieldsAsync());
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<FieldResponseDto>> GetById(Guid id)
        {
            var result = await _fieldService.GetFieldByIdAsync(id);
            if (result == null)
            {
                return NotFound();
            }
            return Ok(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<FieldResponseDto>> Create([FromBody] CreateFieldDto dto)
        {
            var result = await _fieldService.CreateFieldAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = result.FieldId }, result);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id:guid}")]
        public async Task<ActionResult<FieldResponseDto>> Update(Guid id, [FromBody] UpdateFieldDto dto)
        {
            var result = await _fieldService.UpdateFieldAsync(id, dto);
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
            await _fieldService.DeleteFieldAsync(id);
            return NoContent();
        }

        [HttpGet("sportcenter/{sportCenterId:guid}")]
        public async Task<ActionResult<List<FieldResponseDto>>> GetBySportCenter(Guid sportCenterId)
        {
            return Ok(await _fieldService.GetFieldsBySportCenterAsync(sportCenterId));
        }

        [HttpGet("type/{type}")]
        public async Task<ActionResult<List<FieldResponseDto>>> GetByType(string type)
        {
            return Ok(await _fieldService.GetFieldsByTypeAsync(type));
        }

        [HttpGet("price-range")]
        public async Task<ActionResult<List<FieldResponseDto>>> GetByPriceRange([FromQuery] double minPrice, [FromQuery] double maxPrice)
        {
            return Ok(await _fieldService.GetFieldsByPriceRangeAsync(minPrice, maxPrice));
        }
    }
}
