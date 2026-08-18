using SportHub.DTOs.SportCenter;

namespace SportHub.Services.Interfaces
{
    public interface IFavoriteService
    {
        Task ToggleFavoriteAsync(Guid userId, Guid sportCenterId);
        Task<bool> CheckIsFavoriteAsync(Guid userId, Guid sportCenterId);
        Task<List<SportCenterResponseDto>> GetFavoriteCentersAsync(Guid userId);
    }
}
