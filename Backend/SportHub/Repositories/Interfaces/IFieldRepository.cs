using SportHub.Models;

namespace SportHub.Repositories.Interfaces
{
    public interface IFieldRepository
    {
        Task<List<Fields>> GetAllAsync();
        Task<Fields?> GetByIdAsync(Guid id);
        Task AddAsync(Fields addField);
        Task UpdateAsync(Fields updateField);
        Task DeleteAsync(Guid id);
        Task<List<Fields>> GetBySportCenterId(Guid centerId);
        Task<List<Fields>> GetByType(string type);
        Task<List<Fields>> GetByPriceRange(double minPrice, double maxPrice);
    }
}
