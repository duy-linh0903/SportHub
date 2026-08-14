using SportHub.Models;

namespace SportHub.Repositories.Interfaces
{
    public interface IServiceRepository
    {
        Task<List<ServiceItem>> GetAllAsync();
        Task<ServiceItem?> GetByIdAsync(Guid id);
        Task AddAsync(ServiceItem service);
        Task UpdateAsync(ServiceItem updateService);
        Task DeleteAsync(Guid id);
        Task<List<ServiceItem>> GetByFieldTypeAsync(string type);
        Task<List<ServiceItem>> GetBySportCenterAsync(Guid sportCenterId);
    }
}
