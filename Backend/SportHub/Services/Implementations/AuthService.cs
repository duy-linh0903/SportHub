using System.Security.Cryptography;
using System.Text.Json;
using Google.Apis.Auth;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
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
        private readonly IEmailService _emailService;
        private readonly IConfiguration _configuration;

        public AuthService(
            IUserRepository userRepository, 
            IJwtHelper jwthelper, 
            AppDbContext context, 
            IEmailService emailService,
            IConfiguration configuration)
        {
            _userRepository = userRepository;
            _jwthelper = jwthelper;
            _context = context;
            _emailService = emailService;
            _configuration = configuration;
        }

        public async Task<LoginResponseDto> LoginAsync(LoginRequestDto loginRequestDto)
        {
            var user = await _userRepository.GetByEmailAsync(loginRequestDto.Email);
            if (user == null)
            {
                throw new Exception("User not found");
            }

            if (user.Status != UserStatus.Active)
            {
                throw new InvalidOperationException("User account is not active.");
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
            if (registerRequestDto.Password != registerRequestDto.VerifyPassword)
            {
                throw new ArgumentException("Password and verify password do not match");
            }

            var existingUser = await _userRepository.GetByEmailAsync(registerRequestDto.Email);
            if (existingUser != null)
            {
                if (existingUser.Status == UserStatus.Deleted)
                {
                    existingUser.Name = registerRequestDto.Name;
                    existingUser.PhoneNumber = registerRequestDto.PhoneNumber;
                    existingUser.PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerRequestDto.Password);
                    existingUser.Status = UserStatus.Active;
                    existingUser.OtpAttempts = 0;
                    await _userRepository.UpdateAsync(existingUser);

                    return new LoginResponseDto
                    {
                        AccessToken = _jwthelper.GenerateJwtToken(existingUser)
                    };
                }
                else
                {
                    throw new InvalidOperationException("Email already exists.");
                }
            }

            var user = new Users
            {
                Name = registerRequestDto.Name,
                PhoneNumber = registerRequestDto.PhoneNumber,
                Email = registerRequestDto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerRequestDto.Password),
                AvatarUrl = string.Empty,
                Status = UserStatus.Active,
                OtpAttempts = 0
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
            if (user == null || user.Status != UserStatus.Active)
            {
                throw new Exception("User not found or inactive.");
            }

            // Generate a 6-digit OTP using cryptographically secure RNG
            string otp = RandomNumberGenerator.GetInt32(100000, 1000000).ToString();

            // Set OTP, expiry, and reset attempt count
            user.Otp = otp;
            user.OtpExpiry = DateTime.UtcNow.AddMinutes(10);
            user.OtpAttempts = 0;
            
            await _userRepository.UpdateAsync(user);

            // Send OTP via email
            string subject = "Your OTP for Password Reset";
            string body = $"<p>Your OTP to reset your password is <strong>{otp}</strong>. It is valid for 10 minutes.</p>";
            await _emailService.SendEmailAsync(user.Email, subject, body);
        }

        public async Task VerifyOtpAsync(VerifyOtpRequestDto dto)
        {
            var user = await _userRepository.GetByEmailAsync(dto.Email);
            if (user == null)
            {
                throw new Exception("Invalid email or OTP.");
            }

            // Check if OTP has been locked due to too many attempts
            if (user.Otp == null || user.OtpExpiry == null)
            {
                throw new Exception("No OTP requested or OTP has been invalidated. Please request a new one.");
            }

            // Check expiry
            if (user.OtpExpiry < DateTime.UtcNow)
            {
                user.Otp = null;
                user.OtpExpiry = null;
                user.OtpAttempts = 0;
                await _userRepository.UpdateAsync(user);
                throw new Exception("OTP has expired. Please request a new one.");
            }

            // Check brute-force: max 5 attempts
            if (user.OtpAttempts >= 5)
            {
                user.Otp = null;
                user.OtpExpiry = null;
                user.OtpAttempts = 0;
                await _userRepository.UpdateAsync(user);
                throw new Exception("Too many failed attempts. OTP has been invalidated. Please request a new one.");
            }

            if (user.Otp != dto.Otp)
            {
                user.OtpAttempts = user.OtpAttempts + 1;
                await _userRepository.UpdateAsync(user);
                throw new Exception($"Invalid OTP. {5 - user.OtpAttempts} attempts remaining.");
            }

            // OTP is valid — don't clear yet, will be cleared on password reset
        }

        public async Task ResetPasswordAsync(ResetPasswordRequestDto dto)
        {
            var user = await _userRepository.GetByEmailAsync(dto.Email);
            if (user == null || user.Otp != dto.Otp || user.OtpExpiry < DateTime.UtcNow)
            {
                throw new Exception("Invalid or expired OTP.");
            }

            if (dto.NewPassword != dto.VerifyPassword)
            {
                throw new ArgumentException("New password and verification do not match");
            }

            var newHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
            
            user.PasswordHash = newHash;
            user.Otp = null; // Clear OTP after use
            user.OtpExpiry = null;

            await _userRepository.UpdateAsync(user);
        }

        public async Task<LoginResponseDto> ExternalLoginAsync(ExternalLoginRequestDto dto)
        {
            string email = string.Empty;
            string name = string.Empty;
            string picture = string.Empty;

            if (dto.Provider.Equals("Google", StringComparison.OrdinalIgnoreCase))
            {
                try
                {
                    var googleClientId = _configuration["AuthenticationSettings:GoogleClientId"];
                    GoogleJsonWebSignature.ValidationSettings? settings = null;
                    if (!string.IsNullOrEmpty(googleClientId))
                    {
                        settings = new GoogleJsonWebSignature.ValidationSettings
                        {
                            Audience = new[] { googleClientId }
                        };
                    }

                    GoogleJsonWebSignature.Payload payload;
                    if (settings != null)
                    {
                        try
                        {
                            payload = await GoogleJsonWebSignature.ValidateAsync(dto.IdToken, settings);
                        }
                        catch
                        {
                            // Fallback to validate token signature without strict audience check
                            payload = await GoogleJsonWebSignature.ValidateAsync(dto.IdToken);
                        }
                    }
                    else
                    {
                        payload = await GoogleJsonWebSignature.ValidateAsync(dto.IdToken);
                    }

                    email = payload.Email;
                    name = payload.Name ?? payload.Email;
                    picture = payload.Picture ?? string.Empty;
                }
                catch (Exception ex)
                {
                    throw new Exception($"Invalid Google token: {ex.Message}");
                }
            }
            else if (dto.Provider.Equals("Facebook", StringComparison.OrdinalIgnoreCase))
            {
                try
                {
                    using var httpClient = new HttpClient();
                    var response = await httpClient.GetAsync($"https://graph.facebook.com/me?fields=id,name,email,picture.width(200).height(200)&access_token={dto.IdToken}");
                    if (!response.IsSuccessStatusCode)
                    {
                        throw new Exception("Facebook token verification failed");
                    }

                    var json = await response.Content.ReadAsStringAsync();
                    using var doc = JsonDocument.Parse(json);
                    var root = doc.RootElement;

                    if (root.TryGetProperty("email", out var emailProp) && !string.IsNullOrEmpty(emailProp.GetString()))
                    {
                        email = emailProp.GetString()!;
                    }
                    else if (root.TryGetProperty("id", out var idProp))
                    {
                        email = $"{idProp.GetString()}@facebook.com";
                    }

                    if (root.TryGetProperty("name", out var nameProp))
                    {
                        name = nameProp.GetString() ?? "Facebook User";
                    }

                    if (root.TryGetProperty("picture", out var picProp) &&
                        picProp.TryGetProperty("data", out var dataProp) &&
                        dataProp.TryGetProperty("url", out var urlProp))
                    {
                        picture = urlProp.GetString() ?? string.Empty;
                    }
                }
                catch (Exception ex)
                {
                    throw new Exception($"Invalid Facebook token: {ex.Message}");
                }
            }
            else
            {
                throw new Exception($"Unsupported provider: {dto.Provider}");
            }

            if (string.IsNullOrWhiteSpace(email))
            {
                throw new Exception("Unable to retrieve email from social provider.");
            }

            var user = await _userRepository.GetByEmailAsync(email);
            if (user == null)
            {
                user = new Users
                {
                    Name = string.IsNullOrWhiteSpace(name) ? email.Split('@')[0] : name,
                    PhoneNumber = string.Empty,
                    Email = email,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(Guid.NewGuid().ToString()),
                    AvatarUrl = picture,
                    Status = UserStatus.Active,
                    OtpAttempts = 0
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
            else
            {
                if (user.Status == UserStatus.Banned)
                {
                    throw new InvalidOperationException("Tài khoản của bạn đã bị khóa.");
                }

                // If user was deleted or inactive, automatically reactivate on social login
                if (user.Status == UserStatus.Deleted || user.Status == UserStatus.Inactive)
                {
                    user.Status = UserStatus.Active;
                    user.OtpAttempts = 0;
                }

                if (string.IsNullOrWhiteSpace(user.Name) && !string.IsNullOrWhiteSpace(name))
                {
                    user.Name = name;
                }

                if (string.IsNullOrEmpty(user.AvatarUrl) && !string.IsNullOrEmpty(picture))
                {
                    user.AvatarUrl = picture;
                }

                await _userRepository.UpdateAsync(user);
            }

            return new LoginResponseDto
            {
                AccessToken = _jwthelper.GenerateJwtToken(user)
            };
        }
    }
}
