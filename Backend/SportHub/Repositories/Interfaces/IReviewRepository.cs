using SportHub.Models;

namespace SportHub.Repositories.Interfaces
{
    public interface IReviewRepository
    {
        Task<List<Reviews>> GetBySportCenterIdAsync(Guid id);
        Task AddAsync(Reviews review);
    }
}
