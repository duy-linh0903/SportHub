using SportHub.Models;

namespace SportHub.Repositories.Interfaces
{
    public interface ISportCenterRepository
    {
        Task<List<SportCenters>> GetAllAsync();
        Task<SportCenters?> GetByIdAsync(Guid id);
        Task AddAsync(SportCenters createSportCenter);
        Task UpdateAsync(SportCenters updateSportCenter);
        Task DeleteAsync(Guid id);
        Task<List<SportCenters>> SearchByNameAsync(string name);
    }
}