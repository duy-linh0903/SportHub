using SportHub.DTOs.User;
using SportHub.Models;

namespace SportHub.Services.Interfaces
{
    public interface IUserService
    {
        Task<List<UserResponseDto>> GetAllUsersAsync();
        Task<UserResponseDto?> GetUserByIdAsync(Guid id);
        Task<UserResponseDto?> GetUserByEmailAsync(string email);
        Task<bool> EmailExistsAsync(string email);
        Task<UserResponseDto?> UpdateUserAsync(Guid id, UpdateProfileDto dto);
        Task DeleteUserAsync(Guid id);
    }
}
