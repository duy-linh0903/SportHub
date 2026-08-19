using Microsoft.EntityFrameworkCore;
using SportHub.Data;
using SportHub.Models;
using SportHub.Services.Implementations;
using Xunit;

namespace SportHub.Tests.Services;

public class FavoriteServiceTests
{
    [Fact]
    public async Task CheckIsFavoriteAsync_ReturnsFalseWhenNoFavoriteExists()
    {
        await using var context = Context();
        Assert.False(await new FavoriteService(context).CheckIsFavoriteAsync(Guid.NewGuid(), Guid.NewGuid()));
    }

    [Fact]
    public async Task ToggleFavoriteAsync_AddsThenRemovesFavorite()
    {
        await using var context = Context();
        var userId = Guid.NewGuid(); var centerId = Guid.NewGuid(); var sut = new FavoriteService(context);
        await sut.ToggleFavoriteAsync(userId, centerId);
        Assert.True(await sut.CheckIsFavoriteAsync(userId, centerId));
        await sut.ToggleFavoriteAsync(userId, centerId);
        Assert.False(await sut.CheckIsFavoriteAsync(userId, centerId));
    }

    [Fact]
    public async Task GetFavoriteCentersAsync_ReturnsCenterWithLowestFieldPrice()
    {
        await using var context = Context();
        var userId = Guid.NewGuid(); var center = new SportCenters { Name = "Arena", Address = "HCM", Fields = new List<Fields> { new() { Name = "A", Type = "Football", PricePerSlot = 200 }, new() { Name = "B", Type = "Football", PricePerSlot = 100 } }, Images = new List<SportCenterImages>() };
        context.SportCenters.Add(center); context.FavoriteSportCenters.Add(new FavoriteSportCenters { UserId = userId, SportCenterId = center.Id }); await context.SaveChangesAsync();
        var result = await new FavoriteService(context).GetFavoriteCentersAsync(userId);
        Assert.Single(result); Assert.Equal("Arena", result[0].Name); Assert.Equal(100, result[0].MinPrice);
    }

    private static AppDbContext Context() => new(new DbContextOptionsBuilder<AppDbContext>().UseInMemoryDatabase(Guid.NewGuid().ToString()).Options);
}
