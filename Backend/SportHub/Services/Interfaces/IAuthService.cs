using SportHub.DTOs.Auth;

namespace SportHub.Services.Interfaces
{
    public interface IAuthService
    {
        Task<LoginResponseDto> LoginAsync(LoginRequestDto loginRequestDto);
        Task<LoginResponseDto> RegisterAsync(RegisterRequestDto registerRequestDto);
        Task ChangePasswordAsync(Guid userId, ChangePasswordDto dto);
        Task ForgotPasswordAsync(ForgotPasswordRequestDto dto);
        Task VerifyOtpAsync(VerifyOtpRequestDto dto);
        Task ResetPasswordAsync(ResetPasswordRequestDto dto);
    }
}
