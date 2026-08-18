using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SportHub.DTOs.Booking;
using SportHub.Services.Interfaces;

namespace SportHub.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public class BookingsController : ControllerBase
    {
        private readonly IBookingService _bookingService;
        private readonly ISportCenterService _sportCenterService;

        public BookingsController(IBookingService bookingService, ISportCenterService sportCenterService)
        {
            _bookingService = bookingService;
            _sportCenterService = sportCenterService;
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
                if (booking == null) return NotFound();

                // Only the booking owner or Admin can view by check-in code
                var currentUserId = GetCurrentUserId();
                if (!currentUserId.HasValue) return Forbid();
                if (!User.IsInRole("Admin") && booking.UserId != currentUserId.Value)
                {
                    return Forbid();
                }

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
            var ownerId = GetCurrentUserId();
            if (!ownerId.HasValue) return Unauthorized();

            var booking = await _bookingService.GetBookingByIdAsync(bookingId);
            if (booking == null) return NotFound();

            var sportCenter = await _sportCenterService.GetSportCenterByIdAsync(booking.SportCenterId);
            if (sportCenter != null && sportCenter.OwnerId != ownerId.Value) return Forbid();

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

        [HttpGet("booked-slots")]
        public async Task<ActionResult<List<Guid>>> GetBookedSlots([FromQuery] Guid fieldId, [FromQuery] DateOnly date)
        {
            var bookedSlots = await _bookingService.GetBookedSlotIdsAsync(fieldId, date);
            return Ok(bookedSlots);
        }
    }
}
