using SportHub.DTOs.Service;

namespace SportHub.Services.Interfaces
{
    public interface IServiceItemService
    {
        Task<List<ServiceResponseDto>> GetAllServicesAsync();
        Task<ServiceResponseDto?> GetServiceByIdAsync(Guid id);
        Task<ServiceResponseDto> CreateServiceAsync(CreateServiceDto createServiceDto);
        Task<ServiceResponseDto?> UpdateServiceAsync(Guid id, UpdateServiceDto serviceDto);
        Task DeleteServiceAsync(Guid id);
        Task<List<ServiceResponseDto>> GetServicesByFieldTypeAsync(string fieldType);
        Task<List<ServiceResponseDto>> GetServicesBySportCenterAsync(Guid sportCenterId);
    }
}
