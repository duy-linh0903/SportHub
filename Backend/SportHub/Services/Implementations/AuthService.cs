using Microsoft.EntityFrameworkCore;
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

        public AuthService(IUserRepository userRepository, IJwtHelper jwthelper, AppDbContext context)
        {
            _userRepository = userRepository;
            _jwthelper = jwthelper;
            _context = context;
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
    }
}
