using SportHub.DTOs.Auth;

namespace SportHub.Services.Interfaces
{
    public interface IAuthService
    {
        Task<LoginResponseDto> LoginAsync(LoginRequestDto loginRequestDto);
        Task<LoginResponseDto> RegisterAsync(RegisterRequestDto registerRequestDto);
        Task ChangePasswordAsync(Guid userId, ChangePasswordDto dto);
    }
}
