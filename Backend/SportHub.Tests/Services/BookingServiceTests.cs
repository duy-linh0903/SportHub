using Moq;
using SportHub.DTOs.Booking;
using SportHub.DTOs.Service;
using SportHub.Models;
using SportHub.Repositories.Interfaces;
using SportHub.Services.Implementations;
using SportHub.Services.Interfaces;
using Xunit;

namespace SportHub.Tests.Services;

public class BookingServiceTests
{
    private readonly Mock<IBookingRepository> _bookings = new();
    private readonly Mock<IFieldRepository> _fields = new();
    private readonly Mock<IServiceRepository> _services = new();
    private readonly Mock<IUserRepository> _users = new();

    [Fact]
    public async Task CreateBookingAsync_WithValidRequest_CalculatesPriceAndSavesDetails()
    {
        var userId = Guid.NewGuid(); var fieldId = Guid.NewGuid();
        var slotIds = new List<Guid> { Guid.NewGuid(), Guid.NewGuid() };
        var serviceId = Guid.NewGuid();
        _users.Setup(x => x.GetByIdAsync(userId)).ReturnsAsync(new Users { Status = UserStatus.Active });
        _fields.Setup(x => x.GetByIdAsync(fieldId)).ReturnsAsync(new Fields { Id = fieldId, Name = "Court A", PricePerSlot = 100_000, Status = FieldStatus.Active });
        _bookings.Setup(x => x.GetTimeSlotsByIdsAsync(It.IsAny<List<Guid>>())).ReturnsAsync(slotIds.Select(id => new TimeSlots { Id = id }).ToList());
        _bookings.Setup(x => x.AnySlotConflictAsync(It.IsAny<List<Guid>>(), fieldId, It.IsAny<DateOnly>())).ReturnsAsync(false);
        _services.Setup(x => x.GetByIdAsync(serviceId)).ReturnsAsync(new ServiceItem { Id = serviceId, Name = "Water", Price = 20_000, Status = ServiceStatus.Active });
        Bookings? saved = null; List<BookingServices>? savedServices = null;
        _bookings.Setup(x => x.CreateBookingWithDetailsAsync(It.IsAny<Bookings>(), It.IsAny<List<BookingServices>>(), It.IsAny<List<BookingSlots>>()))
            .Callback<Bookings, List<BookingServices>, List<BookingSlots>>((booking, extras, _) => { saved = booking; savedServices = extras; }).Returns(Task.CompletedTask);

        var result = await Sut().CreateBookingAsync(new CreateBookingDto { FieldId = fieldId, BookingDate = DateOnly.FromDateTime(DateTime.UtcNow), SlotIds = slotIds, ServiceList = new() { new BookingServiceRequestDto { ServiceId = serviceId, Quantity = 2 } } }, userId);

        Assert.Equal(240_000, result.TotalPrice);
        Assert.NotNull(saved); Assert.Equal(240_000, saved!.TotalPrice); Assert.Equal(12, saved.CheckInCode!.Length);
        Assert.Single(savedServices!); Assert.Equal(40_000, savedServices![0].Price);
    }

    [Fact]
    public async Task CreateBookingAsync_WhenUserMissing_ThrowsAndDoesNotSave()
    {
        _users.Setup(x => x.GetByIdAsync(It.IsAny<Guid>())).ReturnsAsync((Users?)null);
        await Assert.ThrowsAsync<KeyNotFoundException>(() => Sut().CreateBookingAsync(new CreateBookingDto(), Guid.NewGuid()));
        _bookings.Verify(x => x.CreateBookingWithDetailsAsync(It.IsAny<Bookings>(), It.IsAny<List<BookingServices>>(), It.IsAny<List<BookingSlots>>()), Times.Never);
    }

    [Fact]
    public async Task CreateBookingAsync_WhenUserInactive_Throws()
    {
        _users.Setup(x => x.GetByIdAsync(It.IsAny<Guid>())).ReturnsAsync(new Users { Status = UserStatus.Inactive });
        await Assert.ThrowsAsync<InvalidOperationException>(() => Sut().CreateBookingAsync(new CreateBookingDto(), Guid.NewGuid()));
    }

    [Fact]
    public async Task CreateBookingAsync_WhenFieldMissing_Throws()
    {
        var id = Guid.NewGuid(); _users.Setup(x => x.GetByIdAsync(id)).ReturnsAsync(new Users { Status = UserStatus.Active });
        _fields.Setup(x => x.GetByIdAsync(It.IsAny<Guid>())).ReturnsAsync((Fields?)null);
        await Assert.ThrowsAsync<KeyNotFoundException>(() => Sut().CreateBookingAsync(new CreateBookingDto { FieldId = Guid.NewGuid() }, id));
    }

    [Fact]
    public async Task CreateBookingAsync_WhenSlotsEmpty_Throws()
    {
        var id = Guid.NewGuid(); _users.Setup(x => x.GetByIdAsync(id)).ReturnsAsync(new Users { Status = UserStatus.Active });
        _fields.Setup(x => x.GetByIdAsync(It.IsAny<Guid>())).ReturnsAsync(new Fields { Status = FieldStatus.Active });
        await Assert.ThrowsAsync<ArgumentException>(() => Sut().CreateBookingAsync(new CreateBookingDto { SlotIds = new() }, id));
    }

    [Fact]
    public async Task CreateBookingAsync_WhenDateInPast_Throws()
    {
        var id = Guid.NewGuid(); _users.Setup(x => x.GetByIdAsync(id)).ReturnsAsync(new Users { Status = UserStatus.Active });
        _fields.Setup(x => x.GetByIdAsync(It.IsAny<Guid>())).ReturnsAsync(new Fields { Status = FieldStatus.Active });
        await Assert.ThrowsAsync<ArgumentException>(() => Sut().CreateBookingAsync(new CreateBookingDto { SlotIds = new() { Guid.NewGuid() }, BookingDate = DateOnly.FromDateTime(DateTime.UtcNow).AddDays(-1) }, id));
    }

    [Fact]
    public async Task CreateBookingAsync_WhenSlotConflicts_Throws()
    {
        var id = Guid.NewGuid(); var fieldId = Guid.NewGuid(); var slot = Guid.NewGuid();
        _users.Setup(x => x.GetByIdAsync(id)).ReturnsAsync(new Users { Status = UserStatus.Active });
        _fields.Setup(x => x.GetByIdAsync(fieldId)).ReturnsAsync(new Fields { Status = FieldStatus.Active });
        _bookings.Setup(x => x.GetTimeSlotsByIdsAsync(It.IsAny<List<Guid>>())).ReturnsAsync(new List<TimeSlots> { new() { Id = slot } });
        _bookings.Setup(x => x.AnySlotConflictAsync(It.IsAny<List<Guid>>(), fieldId, It.IsAny<DateOnly>())).ReturnsAsync(true);
        await Assert.ThrowsAsync<InvalidOperationException>(() => Sut().CreateBookingAsync(new CreateBookingDto { FieldId = fieldId, BookingDate = DateOnly.FromDateTime(DateTime.UtcNow), SlotIds = new() { slot } }, id));
    }

    [Theory]
    [InlineData(BookingStatus.Pending, BookingStatus.Confirmed, true)]
    [InlineData(BookingStatus.Pending, BookingStatus.Completed, false)]
    [InlineData(BookingStatus.Confirmed, BookingStatus.Completed, true)]
    [InlineData(BookingStatus.Completed, BookingStatus.Cancelled, false)]
    public async Task UpdateBookingStatusAsync_OnlyAllowsValidTransitions(BookingStatus current, BookingStatus next, bool allowed)
    {
        var id = Guid.NewGuid(); _bookings.Setup(x => x.GetByIdAsync(id)).ReturnsAsync(new Bookings { Id = id, Status = current });
        if (allowed) { await Sut().UpdateBookingStatusAsync(id, next); _bookings.Verify(x => x.UpdateStatusAsync(id, next.ToString()), Times.Once); }
        else await Assert.ThrowsAsync<InvalidOperationException>(() => Sut().UpdateBookingStatusAsync(id, next));
    }

    private BookingService Sut() => new(_bookings.Object, _fields.Object, _services.Object, _users.Object, null!);
}
