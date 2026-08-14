using Microsoft.EntityFrameworkCore;
using SportHub.Data;
using SportHub.Models;
using SportHub.Repositories.Interfaces;

namespace SportHub.Repositories.Implementations
{
    public class ReviewRepository : IReviewRepository
    {
        private readonly AppDbContext _context;

        public ReviewRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Reviews>> GetBySportCenterIdAsync(Guid id)
        {
            var result = await _context.Reviews
                .Include(r => r.Users)
                .Include(r => r.SportCenters)
                .Where(r => r.SportCenterId == id)
                .ToListAsync();
            return result;
        }

        public async Task<List<Reviews>> GetByOwnerIdAsync(Guid ownerId)
        {
            var result = await _context.Reviews
                .Include(r => r.SportCenters)
                .Include(r => r.Users)
                .Where(r => r.SportCenters.OwnerId == ownerId)
                .ToListAsync();
            return result;
        }

        public async Task AddAsync(Reviews review)
        {
            await _context.Reviews.AddAsync(review);
            await _context.SaveChangesAsync();
        }
    }
}
