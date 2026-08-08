using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SportHub.DTOs.Service;
using SportHub.Services.Interfaces;

namespace SportHub.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ServicesController : ControllerBase
    {
        private readonly IServiceItemService _serviceItemService;

        public ServicesController(IServiceItemService serviceItemService)
        {
            _serviceItemService = serviceItemService;
        }

        [HttpGet]
        public async Task<ActionResult<List<ServiceResponseDto>>> GetAll()
        {
            return Ok(await _serviceItemService.GetAllServicesAsync());
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<ServiceResponseDto>> GetById(Guid id)
        {
            var result = await _serviceItemService.GetServiceByIdAsync(id);
            if (result == null)
            {
                return NotFound();
            }
            return Ok(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<ServiceResponseDto>> Create([FromBody] CreateServiceDto dto)
        {
            var result = await _serviceItemService.CreateServiceAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = result.ServiceId }, result);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id:guid}")]
        public async Task<ActionResult<ServiceResponseDto>> Update(Guid id, [FromBody] UpdateServiceDto dto)
        {
            var result = await _serviceItemService.UpdateServiceAsync(id, dto);
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
            await _serviceItemService.DeleteServiceAsync(id);
            return NoContent();
        }

        [HttpGet("field-type/{type}")]
        public async Task<ActionResult<List<ServiceResponseDto>>> GetByFieldType(string type)
        {
            return Ok(await _serviceItemService.GetServicesByFieldTypeAsync(type));
        }
    }
}
