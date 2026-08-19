using Moq;
using SportHub.DTOs.Review;
using SportHub.DTOs.SportCenter;
using SportHub.Models;
using SportHub.Repositories.Interfaces;
using SportHub.Services.Implementations;
using Xunit;

namespace SportHub.Tests.Services;

public class ReviewServiceTests
{
    private readonly Mock<IReviewRepository> _reviews = new(); private readonly Mock<IBookingRepository> _bookings = new();
    [Fact] public async Task CreateReviewAsync_WhenBookingMissing_Throws() { _bookings.Setup(x => x.GetByIdAsync(It.IsAny<Guid>())).ReturnsAsync((Bookings?)null); await Assert.ThrowsAsync<Exception>(() => Sut().CreateReviewAsync(new CreateReviewDto { BookingId = Guid.NewGuid() }, Guid.NewGuid())); }
    [Fact] public async Task CreateReviewAsync_WhenUserDoesNotOwnBooking_Throws() { _bookings.Setup(x => x.GetByIdAsync(It.IsAny<Guid>())).ReturnsAsync(new Bookings { UserId = Guid.NewGuid() }); await Assert.ThrowsAsync<Exception>(() => Sut().CreateReviewAsync(new CreateReviewDto { BookingId = Guid.NewGuid() }, Guid.NewGuid())); }
    [Fact] public async Task CreateReviewAsync_WhenBookingNotCompleted_Throws() { var id = Guid.NewGuid(); _bookings.Setup(x => x.GetByIdAsync(It.IsAny<Guid>())).ReturnsAsync(new Bookings { UserId = id, Status = BookingStatus.Confirmed }); await Assert.ThrowsAsync<Exception>(() => Sut().CreateReviewAsync(new CreateReviewDto { BookingId = Guid.NewGuid() }, id)); }
    [Fact] public async Task CreateReviewAsync_WhenAlreadyReviewed_Throws() { var id = Guid.NewGuid(); _bookings.Setup(x => x.GetByIdAsync(It.IsAny<Guid>())).ReturnsAsync(new Bookings { UserId = id, Status = BookingStatus.Completed }); _reviews.Setup(x => x.GetByBookingAndUserAsync(It.IsAny<Guid>(), id)).ReturnsAsync(new Reviews()); await Assert.ThrowsAsync<InvalidOperationException>(() => Sut().CreateReviewAsync(new CreateReviewDto { BookingId = Guid.NewGuid() }, id)); }
    [Fact] public async Task CreateReviewAsync_WhenValid_SavesReview() { var id = Guid.NewGuid(); var dto = new CreateReviewDto { BookingId = Guid.NewGuid(), SportCenterId = Guid.NewGuid(), Rating = 5, Comment = "Great" }; _bookings.Setup(x => x.GetByIdAsync(dto.BookingId)).ReturnsAsync(new Bookings { UserId = id, Status = BookingStatus.Completed, User = new Users { Name = "User" } }); _reviews.Setup(x => x.GetByBookingAndUserAsync(dto.BookingId, id)).ReturnsAsync((Reviews?)null); await Sut().CreateReviewAsync(dto, id); _reviews.Verify(x => x.AddAsync(It.Is<Reviews>(r => r.Rating == 5 && r.Comment == "Great" && r.UserId == id)), Times.Once); }
    private ReviewService Sut() => new(_reviews.Object, _bookings.Object);
}

public class SportCenterServiceTests
{
    private readonly Mock<ISportCenterRepository> _repository = new();
    [Fact] public async Task GetSportCenterByIdAsync_WhenMissing_ReturnsNull() { _repository.Setup(x => x.GetByIdAsync(It.IsAny<Guid>())).ReturnsAsync((SportCenters?)null); Assert.Null(await Sut().GetSportCenterByIdAsync(Guid.NewGuid())); }
    [Fact] public async Task GetSportCenterByIdAsync_CalculatesMinPrice() { var c = new SportCenters { Name = "A", Address = "B", Fields = new List<Fields> { new() { PricePerSlot = 200 }, new() { PricePerSlot = 100 } } }; _repository.Setup(x => x.GetByIdAsync(c.Id)).ReturnsAsync(c); var result = await Sut().GetSportCenterByIdAsync(c.Id); Assert.Equal(100, result!.MinPrice); }
    [Fact] public async Task GetSportCenterByIdAsync_WithoutFields_UsesZeroMinPrice() { var c = new SportCenters { Name = "A", Address = "B", Fields = new List<Fields>() }; _repository.Setup(x => x.GetByIdAsync(c.Id)).ReturnsAsync(c); Assert.Equal(0, (await Sut().GetSportCenterByIdAsync(c.Id))!.MinPrice); }
    [Fact] public async Task DeleteSportCenterAsync_WhenMissing_Throws() { _repository.Setup(x => x.GetByIdAsync(It.IsAny<Guid>())).ReturnsAsync((SportCenters?)null); await Assert.ThrowsAsync<KeyNotFoundException>(() => Sut().DeleteSportCenterAsync(Guid.NewGuid())); }
    [Fact] public async Task RestoreSportCenterAsync_WhenFound_Delegates() { var id = Guid.NewGuid(); _repository.Setup(x => x.GetByIdAsync(id)).ReturnsAsync(new SportCenters()); await Sut().RestoreSportCenterAsync(id); _repository.Verify(x => x.RestoreAsync(id), Times.Once); }
    private SportCenterService Sut() => new(_repository.Object);
}
