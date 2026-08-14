using Microsoft.EntityFrameworkCore;
using SportHub.Data;
using SportHub.Models;
using SportHub.Repositories.Interfaces;

namespace SportHub.Repositories.Implementations
{
    public class ServiceRepository : IServiceRepository
    {
        private readonly AppDbContext _context;

        public ServiceRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<ServiceItem>> GetAllAsync()
        {
            var result = await _context.ServiceItem.ToListAsync();
            return result;
        }

        public async Task<ServiceItem?> GetByIdAsync(Guid id)
        {
            return await _context.ServiceItem.FirstOrDefaultAsync(s => s.Id == id);
        }

        public async Task AddAsync(ServiceItem service)
        {
            await _context.ServiceItem.AddAsync(service);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(ServiceItem updateService)
        {
            var service = await _context.ServiceItem.FirstOrDefaultAsync(s => s.Id == updateService.Id);
            if (service != null)
            {
                service.Name = updateService.Name;
                service.Price = updateService.Price;
                service.Description = updateService.Description;
                await _context.SaveChangesAsync();
            }
        }

        public async Task DeleteAsync(Guid id)
        {
            var service = await _context.ServiceItem.FirstOrDefaultAsync(s => s.Id == id);
            if (service !=null)
            {
                service.Status = ServiceStatus.Deleted;
                await _context.SaveChangesAsync();
            }
        }

        public async Task<List<ServiceItem>> GetByFieldTypeAsync(string type)
        {
            return await _context.ServiceItem.Where(s => s.Type == type).ToListAsync();
        }

        public async Task<List<ServiceItem>> GetBySportCenterAsync(Guid sportCenterId)
        {
            return await _context.ServiceItem
                .Where(s => s.Status != ServiceStatus.Deleted && (s.SportCenterId == sportCenterId || s.SportCenterId == null))
                .ToListAsync();
        }
    }
}
