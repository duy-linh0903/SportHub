using Microsoft.EntityFrameworkCore;
using SportHub.Data;
using SportHub.Models;
using SportHub.Repositories.Interfaces;

namespace SportHub.Repositories.Implementations
{
    public class SportCenterRepository : ISportCenterRepository
    {
        private readonly AppDbContext _context;

        public SportCenterRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<SportCenters>> GetAllAsync()
        {
            return await _context.SportCenters.Include(sc => sc.Images).Include(sc => sc.Fields).ToListAsync();
        }

        public async Task<SportCenters?> GetByIdAsync(Guid id)
        {
            return await _context.SportCenters.Include(sc => sc.Images).FirstOrDefaultAsync(s => s.Id == id);
        }

        public async Task AddAsync(SportCenters sport)
        {
            await _context.SportCenters.AddAsync(sport);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(SportCenters updateSport)
        {
            var sport = await _context.SportCenters.FirstOrDefaultAsync(s => s.Id == updateSport.Id);
            if (sport !=  null)
            {
                sport.Name = updateSport.Name;
                sport.Address = updateSport.Address;
                sport.Description = updateSport.Description;
                sport.Images = updateSport.Images;
                await _context.SaveChangesAsync();
            }
        }

        public async Task DeleteAsync(Guid id)
        {
            var sport = await _context.SportCenters.FirstOrDefaultAsync(s => s.Id == id);
            if (sport != null)
            {
                sport.Status = SportCenterStatus.Deleted;
                await _context.SaveChangesAsync();
            }
        }

        public async Task<List<SportCenters>> SearchByNameAsync(string name)
        {
            return await _context.SportCenters
                .Include(sc => sc.Images)
                .Where(s => s.Name.Contains(name))
                .ToListAsync();
        }
    }
}
