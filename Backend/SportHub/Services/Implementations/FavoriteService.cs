using Microsoft.EntityFrameworkCore;
using SportHub.Data;
using SportHub.DTOs.SportCenter;
using SportHub.Models;
using SportHub.Services.Interfaces;

namespace SportHub.Services.Implementations
{
    public class FavoriteService : IFavoriteService
    {
        private readonly AppDbContext _context;

        public FavoriteService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<bool> CheckIsFavoriteAsync(Guid userId, Guid sportCenterId)
        {
            return await _context.FavoriteSportCenters
                .AnyAsync(f => f.UserId == userId && f.SportCenterId == sportCenterId);
        }

        public async Task<List<SportCenterResponseDto>> GetFavoriteCentersAsync(Guid userId)
        {
            var favorites = await _context.FavoriteSportCenters
                .Include(f => f.SportCenter)
                .ThenInclude(sc => sc.Images)
                .Include(f => f.SportCenter)
                .ThenInclude(sc => sc.Fields)
                .Where(f => f.UserId == userId)
                .OrderByDescending(f => f.CreatedAt)
                .Select(f => f.SportCenter)
                .ToListAsync();

            var result = new List<SportCenterResponseDto>();
            foreach (var sc in favorites)
            {
                result.Add(new SportCenterResponseDto
                {
                    SportCenterId = sc.Id,
                    Name = sc.Name,
                    Address = sc.Address,
                    Description = sc.Description,
                    CreatedAt = sc.CreatedAt,
                    images = sc.Images?.ToList() ?? new List<SportCenterImages>(),
                    MinPrice = sc.Fields != null && sc.Fields.Any() ? sc.Fields.Min(f => f.PricePerSlot) : 0,
                    Status = sc.Status.ToString()
                });
            }
            return result;
        }

        public async Task ToggleFavoriteAsync(Guid userId, Guid sportCenterId)
        {
            var favorite = await _context.FavoriteSportCenters
                .FirstOrDefaultAsync(f => f.UserId == userId && f.SportCenterId == sportCenterId);

            if (favorite != null)
            {
                _context.FavoriteSportCenters.Remove(favorite);
            }
            else
            {
                _context.FavoriteSportCenters.Add(new FavoriteSportCenters
                {
                    Id = Guid.NewGuid(),
                    UserId = userId,
                    SportCenterId = sportCenterId,
                    CreatedAt = DateTime.UtcNow
                });
            }

            await _context.SaveChangesAsync();
        }
    }
}
