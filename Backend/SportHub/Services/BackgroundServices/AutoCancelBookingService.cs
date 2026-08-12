using Microsoft.EntityFrameworkCore;
using SportHub.Data;
using SportHub.Models;

namespace SportHub.Services.BackgroundServices
{
    public class AutoCancelBookingService : BackgroundService
    {
        private readonly ILogger<AutoCancelBookingService> _logger;
        private readonly IServiceScopeFactory _scopeFactory;

        public AutoCancelBookingService(ILogger<AutoCancelBookingService> logger, IServiceScopeFactory scopeFactory)
        {
            _logger = logger;
            _scopeFactory = scopeFactory;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("AutoCancelBookingService is starting.");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await CancelExpiredBookingsAsync(stoppingToken);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error occurred executing AutoCancelBookingService.");
                }

                // Chạy ngầm định kỳ mỗi 1 phút
                await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
            }
            
            _logger.LogInformation("AutoCancelBookingService is stopping.");
        }

        private async Task CancelExpiredBookingsAsync(CancellationToken stoppingToken)
        {
            using var scope = _scopeFactory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            var now = DateTime.Now;

            // Lấy ra các Booking đang chờ hoặc đã xác nhận
            var bookingsToCheck = await context.Bookings
                .Include(b => b.BookingSlots)
                .ThenInclude(bs => bs.TimeSlots)
                .Where(b => b.Status == BookingStatus.Confirmed || b.Status == BookingStatus.Pending)
                .ToListAsync(stoppingToken);

            var bookingsToCancel = new List<Bookings>();

            foreach (var booking in bookingsToCheck)
            {
                if (booking.BookingSlots.Any())
                {
                    // Lấy TimeSlot sớm nhất của Booking
                    var earliestSlot = booking.BookingSlots.MinBy(bs => bs.TimeSlots.StartTime);
                    if (earliestSlot != null)
                    {
                        var startTime = earliestSlot.TimeSlots.StartTime;
                        var bookingDate = booking.BookingDate;

                        // Ghép ngày và giờ thành DateTime
                        var bookingDateTime = bookingDate.ToDateTime(startTime);

                        // Nếu thời điểm hiện tại lớn hơn giờ đặt sân + 15 phút, tiến hành huỷ
                        if (now >= bookingDateTime.AddMinutes(15))
                        {
                            booking.Status = BookingStatus.Cancelled;
                            bookingsToCancel.Add(booking);
                            _logger.LogInformation($"Đã tự động huỷ Booking ID {booking.Id} do quá hạn 15 phút chưa check-in.");
                        }
                    }
                }
            }

            if (bookingsToCancel.Any())
            {
                context.Bookings.UpdateRange(bookingsToCancel);
                await context.SaveChangesAsync(stoppingToken);
            }
        }
    }
}
