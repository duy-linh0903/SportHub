using SportHub.Models;

namespace SportHub.Repositories.Interfaces
{
    public interface IUserRepository
    {
        Task<List<Users>> GetAllAsync();
        Task<Users?> GetByIdAsync(Guid id);
        Task AddAsync(Users registerUser);
        Task UpdateAsync(Users updateUser);
        Task DeleteAsync(Guid id);
    }
}
