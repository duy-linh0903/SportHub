using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SportHub.DTOs.Booking;
using SportHub.Services.Interfaces;
using System.Security.Claims;

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
        public async Task<IActionResult> GetAllBookings()
        {
            var result = await _bookingService.GetAllBookingsAsync();
            return Ok(result);
        }

        [HttpGet("owner")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetBookingsByOwner()
        {
            var ownerIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(ownerIdString) || !Guid.TryParse(ownerIdString, out Guid ownerId))
            {
                return Unauthorized("Invalid user ID");
            }

            var result = await _bookingService.GetBookingsByOwnerAsync(ownerId);
            return Ok(result);
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<BookingResponseDto>> GetById(Guid id)
        {
            var booking = await _bookingService.GetBookingByIdAsync(id);
            if (booking == null)
            {
                return NotFound();
            }

            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var isAdmin = User.IsInRole("Admin");
            if (!isAdmin && booking.UserId.ToString() != userIdString)
            {
                return Forbid();
            }

            return Ok(booking);
        }

        [HttpGet("checkincode/{code}")]
        public async Task<ActionResult<BookingResponseDto>> GetByCheckInCode(string code)
        {
            try
            {
                var booking = await _bookingService.GetBookingByCheckInCodeAsync(code);
                return Ok(booking);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        [Authorize(Roles = "User,Admin")]
        [HttpPost]
        public async Task<ActionResult<BookingResponseDto>> Create([FromBody] CreateBookingDto bookingDto)
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out Guid userId))
            {
                return Unauthorized();
            }

            var createdBooking = await _bookingService.CreateBookingAsync(bookingDto, userId);
            return CreatedAtAction(nameof(GetById), new { id = createdBooking.BookingId }, createdBooking);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{bookingId:guid}/status")]
        public async Task<IActionResult> UpdateStatus(Guid bookingId, [FromBody] UpdateBookingStatusDto request)
        {
            await _bookingService.UpdateBookingStatusAsync(bookingId, request.Status);
            return NoContent();
        }

        [Authorize(Roles = "User,Admin")]
        [HttpDelete("{bookingId:guid}")]
        public async Task<IActionResult> Cancel(Guid bookingId)
        {
            var booking = await _bookingService.GetBookingByIdAsync(bookingId);
            if (booking == null) return NotFound();

            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var isAdmin = User.IsInRole("Admin");
            if (!isAdmin && booking.UserId.ToString() != userIdString)
            {
                return Forbid();
            }

            await _bookingService.CancelBookingAsync(bookingId);
            return NoContent();
        }

        [Authorize(Roles = "Admin,User")]
        [HttpGet("user/{userId:guid}")]
        public async Task<ActionResult<List<BookingResponseDto>>> GetByUser(Guid userId)
        {
            var currentUserIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var isAdmin = User.IsInRole("Admin");
            if (!isAdmin && userId.ToString() != currentUserIdString)
            {
                return Forbid();
            }

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

        [AllowAnonymous]
        [HttpGet("booked-slots")]
        public async Task<ActionResult<List<Guid>>> GetBookedSlots([FromQuery] Guid fieldId, [FromQuery] DateOnly date)
        {
            var slots = await _bookingService.GetBookedSlotIdsAsync(fieldId, date);
            return Ok(slots);
        }
    }
}
