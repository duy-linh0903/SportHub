using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using SportHub.Data;
using SportHub.DTOs.Auth;
using SportHub.Models;
using SportHub.Repositories.Interfaces;
using SportHub.Services.Interfaces;

namespace SportHub.Services.Implementations
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IJwtHelper _jwthelper;
        private readonly AppDbContext _context;
        private readonly IMemoryCache _cache;
        private readonly IEmailService _emailService;
        private readonly IConfiguration _config;

        public AuthService(IUserRepository userRepository, IJwtHelper jwthelper, AppDbContext context, IMemoryCache cache, IEmailService emailService, IConfiguration config)
        {
            _userRepository = userRepository;
            _jwthelper = jwthelper;
            _context = context;
            _cache = cache;
            _emailService = emailService;
            _config = config;
        }

        public async Task<LoginResponseDto> LoginAsync(LoginRequestDto loginRequestDto)
        {
            var user = await _userRepository.GetByEmailAsync(loginRequestDto.Email);
            if (user == null)
            {
                throw new Exception("User not found");
            }
            bool isValid = BCrypt.Net.BCrypt.Verify(loginRequestDto.Password, user.PasswordHash);
            if (!isValid)
            {
                throw new Exception("Wrong password");
            }

            return new LoginResponseDto
            {
                AccessToken = _jwthelper.GenerateJwtToken(user)
            };
        }

        public async Task<LoginResponseDto> RegisterAsync(RegisterRequestDto registerRequestDto)
        {
            bool checkEmail = await _userRepository.EmailExistsAsync(registerRequestDto.Email);
            if (checkEmail)
            {
                throw new Exception("Email already exists.");
            }
            if (registerRequestDto.Password!=registerRequestDto.VerifyPassword)
            {
                throw new Exception("Password is wrong");
            }
            var user = new Users
            {
                Name = registerRequestDto.Name,
                PhoneNumber = registerRequestDto.PhoneNumber,
                Email = registerRequestDto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerRequestDto.Password),
                AvatarUrl = string.Empty,
                Status = UserStatus.Active
            };
            await _userRepository.AddAsync(user);

            var defaultRole = await _context.Roles.FirstOrDefaultAsync(r => r.RoleName == "User");
            if (defaultRole == null)
            {
                throw new InvalidOperationException("Default role 'User' is not configured. Run database seed or contact admin.");
            }

            await _context.UserRoles.AddAsync(new UserRoles
            {
                UserId = user.Id,
                RoleId = defaultRole.Id
            });
            await _context.SaveChangesAsync();

            return new LoginResponseDto
            {
                AccessToken = _jwthelper.GenerateJwtToken(user)
            };
        }

        public async Task ChangePasswordAsync(Guid userId, ChangePasswordDto dto)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
            {
                throw new KeyNotFoundException("User isn't found");
            }

            if (!BCrypt.Net.BCrypt.Verify(dto.OldPassword, user.PasswordHash))
            {
                throw new InvalidOperationException("Old password is incorrect");
            }

            if (dto.NewPassword != dto.VerifyPassword)
            {
                throw new ArgumentException("New password and verification do not match");
            }

            var newHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
            await _userRepository.UpdatePasswordAsync(user.Id, newHash);
        }

        public async Task ForgotPasswordAsync(ForgotPasswordRequestDto dto)
        {
            var user = await _userRepository.GetByEmailAsync(dto.Email);
            if (user == null)
            {
                throw new KeyNotFoundException("Email không tồn tại trong hệ thống.");
            }

            var otp = new Random().Next(100000, 999999).ToString();
            _cache.Set($"OTP_{dto.Email}", otp, TimeSpan.FromMinutes(5));

            var subject = "Mã xác nhận quên mật khẩu";
            var body = $"Mã OTP của bạn là: {otp}. Mã này sẽ hết hạn trong 5 phút.";
            await _emailService.SendEmailAsync(dto.Email, subject, body);
        }

        public Task VerifyOtpAsync(VerifyOtpRequestDto dto)
        {
            if (!_cache.TryGetValue($"OTP_{dto.Email}", out string? storedOtp) || storedOtp != dto.Otp)
            {
                throw new Exception("Mã OTP không hợp lệ hoặc đã hết hạn.");
            }
            return Task.CompletedTask;
        }

        public async Task ResetPasswordAsync(ResetPasswordRequestDto dto)
        {
            if (!_cache.TryGetValue($"OTP_{dto.Email}", out string? storedOtp) || storedOtp != dto.Otp)
            {
                throw new Exception("Mã OTP không hợp lệ hoặc đã hết hạn.");
            }

            if (dto.NewPassword != dto.VerifyPassword)
            {
                throw new ArgumentException("Mật khẩu xác nhận không khớp.");
            }

            var user = await _userRepository.GetByEmailAsync(dto.Email);
            if (user == null)
            {
                throw new KeyNotFoundException("User không tồn tại.");
            }

            var newHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
            await _userRepository.UpdatePasswordAsync(user.Id, newHash);

            _cache.Remove($"OTP_{dto.Email}");
        }
        public async Task<LoginResponseDto> ExternalLoginAsync(ExternalLoginRequestDto dto)
        {
            string email = "";
            string name = "";

            if (dto.Provider == "Google")
            {
                var settings = new Google.Apis.Auth.GoogleJsonWebSignature.ValidationSettings()
                {
                    Audience = new List<string>() { _config["AuthenticationSettings:GoogleClientId"] }
                };

                try
                {
                    var payload = await Google.Apis.Auth.GoogleJsonWebSignature.ValidateAsync(dto.IdToken, settings);
                    email = payload.Email;
                    name = payload.Name;
                }
                catch (Exception ex)
                {
                    throw new Exception("Google token validation failed: " + ex.Message);
                }
            }
            else if (dto.Provider == "Facebook")
            {
                using var httpClient = new HttpClient();
                var response = await httpClient.GetAsync($"https://graph.facebook.com/me?fields=id,name,email&access_token={dto.IdToken}");
                if (!response.IsSuccessStatusCode)
                {
                    throw new Exception("Facebook token validation failed.");
                }
                var content = await response.Content.ReadAsStringAsync();
                var fbData = System.Text.Json.JsonSerializer.Deserialize<System.Text.Json.JsonElement>(content);
                
                if (fbData.TryGetProperty("email", out var emailProp))
                {
                    email = emailProp.GetString();
                }
                else
                {
                    // Fallback if no email is provided by Facebook
                    email = fbData.GetProperty("id").GetString() + "@facebook.com";
                }
                name = fbData.GetProperty("name").GetString();
            }
            else
            {
                throw new ArgumentException("Unsupported provider.");
            }

            var user = await _userRepository.GetByEmailAsync(email);
            if (user == null)
            {
                // Create a new user
                user = new Users
                {
                    Name = name,
                    Email = email,
                    PhoneNumber = "", // You might not get this from external providers
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(Guid.NewGuid().ToString()), // Random password
                    AvatarUrl = string.Empty,
                    Status = UserStatus.Active
                };
                await _userRepository.AddAsync(user);

                var defaultRole = await _context.Roles.FirstOrDefaultAsync(r => r.RoleName == "User");
                if (defaultRole != null)
                {
                    await _context.UserRoles.AddAsync(new UserRoles
                    {
                        UserId = user.Id,
                        RoleId = defaultRole.Id
                    });
                    await _context.SaveChangesAsync();
                }
            }

            return new LoginResponseDto
            {
                AccessToken = _jwthelper.GenerateJwtToken(user)
            };
        }
    }
}
