using SportHub.Models;

namespace SportHub.Repositories.Interfaces
{
    public interface IReviewRepository
    {
        Task<List<Reviews>> GetBySportCenterIdAsync(Guid id);
        Task<List<Reviews>> GetByOwnerIdAsync(Guid ownerId);
        Task AddAsync(Reviews review);
    }
}
