using SportHub.DTOs.User;
using SportHub.Models;
using SportHub.Repositories.Interfaces;
using SportHub.Services.Interfaces;

namespace SportHub.Services.Implementations
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<List<UserResponseDto>> GetAllUsersAsync()
        {
            var users = await _userRepository.GetAllAsync();
            return users.Select(MapToResponse).ToList();
        }

        public async Task<UserResponseDto?> GetUserByIdAsync(Guid id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null)
            {
                throw new KeyNotFoundException("User isn't found");
            }
            return MapToResponse(user);
        }

        public async Task<UserResponseDto?> GetUserByEmailAsync(string email)
        {
            var user = await _userRepository.GetByEmailAsync(email);
            if (user == null)
            {
                throw new KeyNotFoundException("User isn't found");
            }
            return MapToResponse(user);
        }

        public async Task<bool> EmailExistsAsync(string email)
        {
            return await _userRepository.EmailExistsAsync(email);
        }

        public async Task<UserResponseDto?> UpdateUserAsync(Guid id, UpdateProfileDto dto)
        {
            var existingUser = await _userRepository.GetByIdAsync(id);
            if (existingUser == null)
            {
                return null;
            }

            existingUser.Name = string.IsNullOrWhiteSpace(dto.Name) ? existingUser.Name : dto.Name;
            existingUser.PhoneNumber = string.IsNullOrWhiteSpace(dto.PhoneNumber) ? existingUser.PhoneNumber : dto.PhoneNumber;
            existingUser.Email = string.IsNullOrWhiteSpace(dto.Email) ? existingUser.Email : dto.Email;
            existingUser.AvatarUrl = string.IsNullOrWhiteSpace(dto.AvatarUrl) ? existingUser.AvatarUrl : dto.AvatarUrl;

            await _userRepository.UpdateAsync(existingUser);
            return MapToResponse(existingUser);
        }

        public async Task DeleteUserAsync(Guid id)
        {
            await _userRepository.DeleteAsync(id);
        }

        private static UserResponseDto MapToResponse(Users user)
        {
            return new UserResponseDto
            {
                Name = user.Name,
                PhoneNumber = user.PhoneNumber,
                Email = user.Email,
                AvatarUrl = user.AvatarUrl
            };
        }
    }
}
