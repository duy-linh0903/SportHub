using SportHub.Models;

namespace SportHub.Repositories.Interfaces
{
    public interface IReviewRepository
    {
        Task<List<Reviews>> GetBySportCenterId(Guid id);
        Task AddAsync(Reviews review);
    }
}
