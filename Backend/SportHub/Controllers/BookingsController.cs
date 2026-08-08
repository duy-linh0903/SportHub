using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SportHub.DTOs.Booking;
using SportHub.Services.Interfaces;

namespace SportHub.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class BookingsController : ControllerBase
    {
        private readonly IBookingService _bookingService;

        public BookingsController(IBookingService bookingService)
        {
            _bookingService = bookingService;
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<ActionResult<List<BookingResponseDto>>> GetAll()
        {
            var bookings = await _bookingService.GetAllBookingsAsync();
            return Ok(bookings);
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<BookingResponseDto>> GetById(Guid id)
        {
            var booking = await _bookingService.GetBookingByIdAsync(id);
            if (booking == null)
            {
                return NotFound();
            }
            return Ok(booking);
        }

        [Authorize(Roles = "User")]
        [HttpPost]
        public async Task<ActionResult<BookingResponseDto>> Create([FromBody] CreateBookingDto bookingDto)
        {
            var createdBooking = await _bookingService.CreateBookingAsync(bookingDto, bookingDto.UserId);
            return CreatedAtAction(nameof(GetById), new { id = createdBooking.BookingId }, createdBooking);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{bookingId:guid}/status")]
        public async Task<IActionResult> UpdateStatus(Guid bookingId, [FromBody] UpdateBookingStatusDto request)
        {
            await _bookingService.UpdateBookingStatusAsync(bookingId, request.Status);
            return NoContent();
        }

        [Authorize(Roles = "User")]
        [HttpDelete("{bookingId:guid}")]
        public async Task<IActionResult> Cancel(Guid bookingId)
        {
            await _bookingService.CancelBookingAsync(bookingId);
            return NoContent();
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("user/{userId:guid}")]
        public async Task<ActionResult<List<BookingResponseDto>>> GetByUser(Guid userId)
        {
            var bookings = await _bookingService.GetBookingsByUserAsync(userId);
            return Ok(bookings);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("field/{fieldId:guid}")]
        public async Task<ActionResult<List<BookingResponseDto>>> GetByField(Guid fieldId)
        {
            var bookings = await _bookingService.GetBookingsByFieldAsync(fieldId);
            return Ok(bookings);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("sportcenter/{sportCenterId:guid}")]
        public async Task<ActionResult<List<BookingResponseDto>>> GetBySportCenter(Guid sportCenterId)
        {
            var bookings = await _bookingService.GetBookingsBySportCenterAsync(sportCenterId);
            return Ok(bookings);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("range")]
        public async Task<ActionResult<List<BookingResponseDto>>> GetByDateRange([FromQuery] DateOnly startDate, [FromQuery] DateOnly endDate)
        {
            var bookings = await _bookingService.GetBookingsByDateRangeAsync(startDate, endDate);
            return Ok(bookings);
        }
    }
}
