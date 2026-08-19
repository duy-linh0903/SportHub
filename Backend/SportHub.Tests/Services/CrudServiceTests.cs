using Moq;
using SportHub.DTOs.Field;
using SportHub.DTOs.Service;
using SportHub.DTOs.User;
using SportHub.Models;
using SportHub.Repositories.Interfaces;
using SportHub.Services.Implementations;
using Xunit;

namespace SportHub.Tests.Services;

public class FieldServiceTests
{
    private readonly Mock<IFieldRepository> _repository = new();
    [Fact] public async Task GetFieldByIdAsync_WhenMissing_ReturnsNull() { _repository.Setup(x => x.GetByIdAsync(It.IsAny<Guid>())).ReturnsAsync((Fields?)null); Assert.Null(await Sut().GetFieldByIdAsync(Guid.NewGuid())); }
    [Fact] public async Task CreateFieldAsync_MapsDtoAndSaves() { Fields? saved = null; _repository.Setup(x => x.AddAsync(It.IsAny<Fields>())).Callback<Fields>(x => saved = x).Returns(Task.CompletedTask); var center = Guid.NewGuid(); var result = await Sut().CreateFieldAsync(new CreateFieldDto { SportCenterId = center, Name = "A", Type = "Football", PricePerSlot = 100 }); Assert.Equal("A", result.Name); Assert.NotNull(saved); Assert.Equal(center, saved!.SportCenterId); }
    [Fact] public async Task UpdateFieldAsync_WhenMissing_Throws() { _repository.Setup(x => x.GetByIdAsync(It.IsAny<Guid>())).ReturnsAsync((Fields?)null); await Assert.ThrowsAsync<KeyNotFoundException>(() => Sut().UpdateFieldAsync(Guid.NewGuid(), new UpdateFieldDto())); }
    [Fact] public async Task DeleteFieldAsync_WhenFound_Deletes() { var field = new Fields(); _repository.Setup(x => x.GetByIdAsync(field.Id)).ReturnsAsync(field); await Sut().DeleteFieldAsync(field.Id); _repository.Verify(x => x.DeleteAsync(field), Times.Once); }
    [Fact] public async Task GetFieldsByPriceRangeAsync_MapsList() { _repository.Setup(x => x.GetByPriceRange(1, 2)).ReturnsAsync(new List<Fields> { new() { Name = "A", Type = "T", PricePerSlot = 2 } }); var result = await Sut().GetFieldsByPriceRangeAsync(1, 2); Assert.Single(result); Assert.Equal("A", result[0].Name); }
    private FieldService Sut() => new(_repository.Object);
}

public class ServiceItemServiceTests
{
    private readonly Mock<IServiceRepository> _repository = new();
    [Fact] public async Task GetServiceByIdAsync_WhenMissing_ReturnsNull() { _repository.Setup(x => x.GetByIdAsync(It.IsAny<Guid>())).ReturnsAsync((ServiceItem?)null); Assert.Null(await Sut().GetServiceByIdAsync(Guid.NewGuid())); }
    [Fact] public async Task CreateServiceAsync_MapsDtoAndSaves() { ServiceItem? saved = null; _repository.Setup(x => x.AddAsync(It.IsAny<ServiceItem>())).Callback<ServiceItem>(x => saved = x).Returns(Task.CompletedTask); var result = await Sut().CreateServiceAsync(new CreateServiceDto { Name = "Water", Type = "All", Price = 10 }); Assert.Equal("Water", result.Name); Assert.Equal(10, saved!.Price); }
    [Fact] public async Task UpdateServiceAsync_WhenMissing_Throws() { _repository.Setup(x => x.GetByIdAsync(It.IsAny<Guid>())).ReturnsAsync((ServiceItem?)null); await Assert.ThrowsAsync<KeyNotFoundException>(() => Sut().UpdateServiceAsync(Guid.NewGuid(), new UpdateServiceDto())); }
    [Fact] public async Task DeleteServiceAsync_WhenFound_DeletesById() { var id = Guid.NewGuid(); _repository.Setup(x => x.GetByIdAsync(id)).ReturnsAsync(new ServiceItem()); await Sut().DeleteServiceAsync(id); _repository.Verify(x => x.DeleteAsync(id), Times.Once); }
    [Fact] public async Task GetServicesByFieldTypeAsync_MapsList() { _repository.Setup(x => x.GetByFieldTypeAsync("Football")).ReturnsAsync(new List<ServiceItem> { new() { Name = "Ball", Type = "Football" } }); var result = await Sut().GetServicesByFieldTypeAsync("Football"); Assert.Single(result); Assert.Equal("Ball", result[0].Name); }
    private ServiceItemService Sut() => new(_repository.Object);
}

public class UserServiceTests
{
    private readonly Mock<IUserRepository> _repository = new();
    [Fact] public async Task GetUserByEmailAsync_WhenMissing_ReturnsNull() { _repository.Setup(x => x.GetByEmailAsync("none@test.com")).ReturnsAsync((Users?)null); Assert.Null(await Sut().GetUserByEmailAsync("none@test.com")); }
    [Fact] public async Task EmailExistsAsync_ReturnsRepositoryResult() { _repository.Setup(x => x.EmailExistsAsync("a@test.com")).ReturnsAsync(true); Assert.True(await Sut().EmailExistsAsync("a@test.com")); }
    [Fact] public async Task UpdateUserAsync_OnlyChangesProvidedProperties() { var user = new Users { Name = "Old", PhoneNumber = "1", Email = "old@test.com", AvatarUrl = "old" }; _repository.Setup(x => x.GetByIdAsync(user.Id)).ReturnsAsync(user); var result = await Sut().UpdateUserAsync(user.Id, new UpdateProfileDto { Name = "New", Email = "" }); Assert.Equal("New", result!.Name); Assert.Equal("old@test.com", result.Email); _repository.Verify(x => x.UpdateAsync(user), Times.Once); }
    [Fact] public async Task UpdateUserAsync_WhenMissing_ReturnsNull() { _repository.Setup(x => x.GetByIdAsync(It.IsAny<Guid>())).ReturnsAsync((Users?)null); Assert.Null(await Sut().UpdateUserAsync(Guid.NewGuid(), new UpdateProfileDto())); }
    [Fact] public async Task DeleteUserAsync_DelegatesToRepository() { var id = Guid.NewGuid(); await Sut().DeleteUserAsync(id); _repository.Verify(x => x.DeleteAsync(id), Times.Once); }
    private UserService Sut() => new(_repository.Object);
}
