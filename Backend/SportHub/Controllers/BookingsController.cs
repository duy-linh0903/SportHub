using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SportHub.DTOs.Booking;
using SportHub.Services.Interfaces;
using System.Security.Claims;

namespace SportHub.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public class BookingsController : ControllerBase
    {
        private readonly IBookingService _bookingService;

        public BookingsController(IBookingService bookingService)
        {
            _bookingService = bookingService;
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

        [Authorize]
        [HttpGet("{id:guid}")]
        public async Task<ActionResult<BookingResponseDto>> GetById(Guid id)
        {
            var booking = await _bookingService.GetBookingByIdAsync(id);
            if (booking == null)
            {
                return NotFound();
            }

            var currentUserId = GetCurrentUserId();
            if (!currentUserId.HasValue)
            {
                return Forbid();
            }

            if (!User.IsInRole("Admin") && booking.UserId != currentUserId)
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

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<BookingResponseDto>> Create([FromBody] CreateBookingDto bookingDto)
        {
            var userId = GetCurrentUserId();
            if (!userId.HasValue)
            {
                return Forbid();
            }

            var createdBooking = await _bookingService.CreateBookingAsync(bookingDto, userId.Value);
            return CreatedAtAction(nameof(GetById), new { id = createdBooking.BookingId }, createdBooking);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{bookingId:guid}/status")]
        public async Task<IActionResult> UpdateStatus(Guid bookingId, [FromBody] UpdateBookingStatusDto request)
        {
            await _bookingService.UpdateBookingStatusAsync(bookingId, request.Status);
            return NoContent();
        }

        [Authorize]
        [HttpDelete("{bookingId:guid}")]
        public async Task<IActionResult> Cancel(Guid bookingId)
        {
            var booking = await _bookingService.GetBookingByIdAsync(bookingId);
            if (booking == null)
            {
                return NotFound();
            }

            var currentUserId = GetCurrentUserId();
            if (!currentUserId.HasValue)
            {
                return Forbid();
            }

            if (!User.IsInRole("Admin") && booking.UserId != currentUserId)
            {
                return Forbid();
            }

            await _bookingService.CancelBookingAsync(bookingId);
            return NoContent();
        }

        [Authorize]
        [HttpGet("user/{userId:guid}")]
        public async Task<ActionResult<List<BookingResponseDto>>> GetByUser(Guid userId)
        {
            var currentUserId = GetCurrentUserId();
            if (!currentUserId.HasValue)
            {
                return Forbid();
            }

            if (!User.IsInRole("Admin") && userId != currentUserId)
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
    }
}
