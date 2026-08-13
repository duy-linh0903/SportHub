using Microsoft.EntityFrameworkCore;
using SportHub.Data;
using SportHub.Models;
using SportHub.Repositories.Interfaces;

namespace SportHub.Repositories.Implementations
{
    public class FieldRepository : IFieldRepository
    {
        private readonly AppDbContext _context;

        public FieldRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Fields>> GetAllAsync()
        {
            return await _context.Fields.ToListAsync();
        }

        public async Task<Fields?> GetByIdAsync(Guid id)
        {
            return await _context.Fields.FirstOrDefaultAsync(f => f.Id == id);
        }

        public async Task AddAsync (Fields addField)
        {
            await _context.Fields.AddAsync(addField);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Fields updateField)
        {
            var field = await _context.Fields.FirstOrDefaultAsync(f => f.Id == updateField.Id);
            if (field != null)
            {
                field.SportCenterId = updateField.SportCenterId;
                field.Name = updateField.Name;
                field.Type = updateField.Type;
                field.PricePerSlot = updateField.PricePerSlot;
                await _context.SaveChangesAsync();
            }
        }

        public async Task DeleteAsync(Fields field)
        {
            field.Status = FieldStatus.Deleted;
            await _context.SaveChangesAsync();
        }

        public async Task<List<Fields>> GetBySportCenterId(Guid centerId)
        {
            return await _context.Fields.Where(f => f.SportCenterId == centerId).ToListAsync();
        }

        public async Task<List<Fields>> GetByType(string type)
        {
            return await _context.Fields.Where(f => f.Type == type).ToListAsync();
        }

        public async Task<List<Fields>> GetByPriceRange(double minPrice, double maxPrice)
        {
            return await _context.Fields.Where(f => f.PricePerSlot >= minPrice && f.PricePerSlot <= maxPrice).ToListAsync();
        }
    }
}
