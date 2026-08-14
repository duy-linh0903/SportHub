using SportHub.DTOs.SportCenter;

namespace SportHub.Services.Interfaces
{
    public interface ISportCenterService
    {
        Task<List<SportCenterResponseDto>> GetAllSportCentersAsync();
        Task<SportCenterResponseDto?> GetSportCenterByIdAsync(Guid id);
        Task<SportCenterResponseDto> CreateSportCenterAsync(CreateSportCenterDto sportCenterDto);
        Task<SportCenterResponseDto?> UpdateSportCenterAsync(Guid id, UpdateSportCenterDto sportCenterDto);
        Task DeleteSportCenterAsync(Guid id);
        Task RestoreSportCenterAsync(Guid id);
        Task<List<SportCenterResponseDto>> SearchSportCentersAsync(string name);
        Task<List<SportCenterResponseDto>> GetSportCentersByOwnerIdAsync(Guid ownerId);
    }
}
