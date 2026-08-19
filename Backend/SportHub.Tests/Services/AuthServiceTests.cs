using Microsoft.Extensions.Configuration;
using Moq;
using SportHub.DTOs.Auth;
using SportHub.Models;
using SportHub.Repositories.Interfaces;
using SportHub.Services.Implementations;
using SportHub.Services.Interfaces;
using Xunit;

namespace SportHub.Tests.Services;

public class AuthServiceTests
{
    private readonly Mock<IUserRepository> _userRepository = new();
    private readonly Mock<IJwtHelper> _jwtHelper = new();
    private readonly Mock<IEmailService> _emailService = new();

    [Theory]
    [InlineData("admin@sporthub.com", "Admin@123", "admin-token")]
    [InlineData("user@sporthub.com", "User@123", "user-token")]
    public async Task LoginAsync_WhenActiveAccountUsesCorrectCredentials_ReturnsAccessToken(
        string email,
        string password,
        string expectedToken)
    {
        // Arrange
        var user = new Users
        {
            Id = Guid.NewGuid(),
            Name = email.StartsWith("admin", StringComparison.OrdinalIgnoreCase) ? "Admin" : "User",
            Email = email,
            PhoneNumber = string.Empty,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
            AvatarUrl = string.Empty,
            Status = UserStatus.Active
        };

        _userRepository.Setup(repository => repository.GetByEmailAsync(email))
            .ReturnsAsync(user);
        _jwtHelper.Setup(helper => helper.GenerateJwtToken(user))
            .Returns(expectedToken);

        var sut = CreateSut();

        // Act
        var result = await sut.LoginAsync(new LoginRequestDto
        {
            Email = email,
            Password = password
        });

        // Assert
        Assert.Equal(expectedToken, result.AccessToken);
        _userRepository.Verify(repository => repository.GetByEmailAsync(email), Times.Once);
        _jwtHelper.Verify(helper => helper.GenerateJwtToken(user), Times.Once);
    }

    [Fact]
    public async Task LoginAsync_WhenPasswordIsIncorrect_ThrowsException()
    {
        // Arrange
        const string email = "user@sporthub.com";
        var user = new Users
        {
            Email = email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("User@123"),
            Status = UserStatus.Active
        };
        _userRepository.Setup(repository => repository.GetByEmailAsync(email))
            .ReturnsAsync(user);

        var sut = CreateSut();

        // Act + Assert
        var exception = await Assert.ThrowsAsync<Exception>(() => sut.LoginAsync(new LoginRequestDto
        {
            Email = email,
            Password = "WrongPassword"
        }));

        Assert.Equal("Wrong password", exception.Message);
        _jwtHelper.Verify(helper => helper.GenerateJwtToken(It.IsAny<Users>()), Times.Never);
    }

    [Fact]
    public async Task LoginAsync_WhenAccountIsInactive_ThrowsInvalidOperationException()
    {
        _userRepository.Setup(repository => repository.GetByEmailAsync("inactive@sporthub.com"))
            .ReturnsAsync(new Users { Email = "inactive@sporthub.com", PasswordHash = BCrypt.Net.BCrypt.HashPassword("Password@123"), Status = UserStatus.Inactive });

        await Assert.ThrowsAsync<InvalidOperationException>(() => CreateSut().LoginAsync(new LoginRequestDto
        {
            Email = "inactive@sporthub.com", Password = "Password@123"
        }));
    }

    [Fact]
    public async Task ChangePasswordAsync_WhenOldPasswordIsCorrect_UpdatesPasswordHash()
    {
        var user = new Users { PasswordHash = BCrypt.Net.BCrypt.HashPassword("Old@123") };
        _userRepository.Setup(repository => repository.GetByIdAsync(user.Id)).ReturnsAsync(user);
        string? updatedHash = null;
        _userRepository.Setup(repository => repository.UpdatePasswordAsync(user.Id, It.IsAny<string>()))
            .Callback<Guid, string>((_, hash) => updatedHash = hash)
            .Returns(Task.CompletedTask);

        await CreateSut().ChangePasswordAsync(user.Id, new ChangePasswordDto
        {
            OldPassword = "Old@123", NewPassword = "New@123", VerifyPassword = "New@123"
        });

        Assert.NotNull(updatedHash);
        Assert.True(BCrypt.Net.BCrypt.Verify("New@123", updatedHash));
    }

    [Fact]
    public async Task ResetPasswordAsync_WhenPasswordsDoNotMatch_DoesNotUpdateUser()
    {
        var user = new Users { Email = "user@sporthub.com", Otp = "123456", OtpExpiry = DateTime.UtcNow.AddMinutes(5) };
        _userRepository.Setup(repository => repository.GetByEmailAsync(user.Email)).ReturnsAsync(user);

        await Assert.ThrowsAsync<ArgumentException>(() => CreateSut().ResetPasswordAsync(new ResetPasswordRequestDto
        {
            Email = user.Email, Otp = "123456", NewPassword = "New@123", VerifyPassword = "Different@123"
        }));

        _userRepository.Verify(repository => repository.UpdateAsync(It.IsAny<Users>()), Times.Never);
    }

    [Fact]
    public async Task LoginAsync_WhenAccountDoesNotExist_ThrowsException()
    {
        // Arrange
        const string email = "missing@sporthub.com";
        _userRepository.Setup(repository => repository.GetByEmailAsync(email))
            .ReturnsAsync((Users?)null);

        var sut = CreateSut();

        // Act + Assert
        var exception = await Assert.ThrowsAsync<Exception>(() => sut.LoginAsync(new LoginRequestDto
        {
            Email = email,
            Password = "AnyPassword"
        }));

        Assert.Equal("User not found", exception.Message);
        _jwtHelper.Verify(helper => helper.GenerateJwtToken(It.IsAny<Users>()), Times.Never);
    }

    private AuthService CreateSut()
    {
        var configuration = new ConfigurationBuilder().Build();

        return new AuthService(
            _userRepository.Object,
            _jwtHelper.Object,
            null!, // LoginAsync does not access AppDbContext.
            _emailService.Object,
            configuration);
    }
}
