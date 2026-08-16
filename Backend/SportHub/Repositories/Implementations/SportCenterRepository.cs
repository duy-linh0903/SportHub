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
            return await _context.SportCenters
                .Where(s => s.Status == SportCenterStatus.Active)
                .Include(sc => sc.Images)
                .Include(sc => sc.Fields)
                .ToListAsync();
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
                
                var oldImages = await _context.SportCenterImages.Where(i => i.SportCenterId == sport.Id).ToListAsync();
                if (oldImages.Any())
                {
                    _context.SportCenterImages.RemoveRange(oldImages);
                }
                
                if (updateSport.Images != null && updateSport.Images.Any())
                {
                    var newImages = updateSport.Images.Select(img => new SportCenterImages
                    {
                        Id = Guid.NewGuid(),
                        SportCenterId = sport.Id,
                        Url = img.Url
                    }).ToList();
                    await _context.SportCenterImages.AddRangeAsync(newImages);
                }

                await _context.SaveChangesAsync();
            }
        }

        public async Task DeleteAsync(Guid id)
        {
            var sport = await _context.SportCenters.Include(s => s.Fields).FirstOrDefaultAsync(s => s.Id == id);
            if (sport != null)
            {
                sport.Status = SportCenterStatus.Deleted;
                if (sport.Fields != null)
                {
                    foreach (var field in sport.Fields)
                    {
                        field.Status = FieldStatus.Deleted;
                    }
                }
                await _context.SaveChangesAsync();
            }
        }

        public async Task RestoreAsync(Guid id)
        {
            var sport = await _context.SportCenters.Include(s => s.Fields).FirstOrDefaultAsync(s => s.Id == id);
            if (sport != null)
            {
                sport.Status = SportCenterStatus.Active;
                if (sport.Fields != null)
                {
                    foreach (var field in sport.Fields)
                    {
                        field.Status = FieldStatus.Active;
                    }
                }
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<SportCenters>> SearchAsync(string name)
        {
            return await _context.SportCenters.Where(s => s.Name.Contains(name) && s.Status == SportCenterStatus.Active)
                                                .Include(s => s.Images)
                                                .Include(s => s.Fields)
                                                .ToListAsync();
        }

        public async Task<IEnumerable<SportCenters>> GetByOwnerIdAsync(Guid ownerId)
        {
            return await _context.SportCenters
                                 .Where(s => s.OwnerId == ownerId)
                                 .Include(s => s.Images)
                                 .Include(s => s.Fields)
                                 .ToListAsync();
        }
    }
}
