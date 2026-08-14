using SportHub.DTOs.Service;
using SportHub.Models;
using SportHub.Repositories.Interfaces;
using SportHub.Services.Interfaces;

namespace SportHub.Services.Implementations
{
    public class ServiceItemService : IServiceItemService
    {
        private readonly IServiceRepository _serviceRepository;
        public ServiceItemService(IServiceRepository serviceRepository)
        {
            _serviceRepository = serviceRepository;
        }
        
        public async Task<List<ServiceResponseDto>> GetAllServicesAsync()
        {
            var serviceList = await _serviceRepository.GetAllAsync();
            return ServiceListDto(serviceList);
        }

        public async Task<ServiceResponseDto?> GetServiceByIdAsync(Guid id)
        {
            var service = await _serviceRepository.GetByIdAsync(id);
            if (service == null)
            {
                return null;
            }
            return ServicesDto(service);
        }

        public async Task<ServiceResponseDto> CreateServiceAsync(CreateServiceDto createServiceDto)
        {
            var serviceItem = new ServiceItem
            {
                Name = createServiceDto.Name,
                Price = createServiceDto.Price,
                Type = createServiceDto.Type,
                Description = createServiceDto.Description,
                SportCenterId = createServiceDto.SportCenterId
            };
            await _serviceRepository.AddAsync(serviceItem);
            return ServicesDto(serviceItem);
        }

        public async Task<ServiceResponseDto?> UpdateServiceAsync(Guid id, UpdateServiceDto serviceDto)
        {
            var serviceItem = await _serviceRepository.GetByIdAsync(id);
            if (serviceItem == null)
            {
                throw new KeyNotFoundException("Service Item isn't found");
            }
            serviceItem.Name = serviceDto.Name;
            serviceItem.Price = serviceDto.Price;
            serviceItem.Type = serviceDto.Type;
            serviceItem.Description = serviceDto.Description;
            serviceItem.SportCenterId = serviceDto.SportCenterId;
            await _serviceRepository.UpdateAsync(serviceItem);
            return ServicesDto(serviceItem);
        }

        public async Task DeleteServiceAsync(Guid id)
        {
            var serviceItem = await _serviceRepository.GetByIdAsync(id);
            if (serviceItem == null)
            {
                throw new KeyNotFoundException("Service Item isn't found");
            }
            await _serviceRepository.DeleteAsync(id);
        }

        public async Task<List<ServiceResponseDto>> GetServicesByFieldTypeAsync(string fieldType)
        {
            var serviceList = await _serviceRepository.GetByFieldTypeAsync(fieldType);
            return ServiceListDto(serviceList);
        }

        public async Task<List<ServiceResponseDto>> GetServicesBySportCenterAsync(Guid sportCenterId)
        {
            var serviceList = await _serviceRepository.GetBySportCenterAsync(sportCenterId);
            return ServiceListDto(serviceList);
        }

        public ServiceResponseDto ServicesDto(ServiceItem item)
        {
            return new ServiceResponseDto
            {
                ServiceId = item.Id,
                Name = item.Name,
                Price = item.Price,
                Description = item.Description,
                SportCenterId = item.SportCenterId
            };
        }

        public List<ServiceResponseDto> ServiceListDto(List<ServiceItem> serviceList)
        {
            var result = new List<ServiceResponseDto>();
            foreach (var service in  serviceList)
            {
                result.Add(ServicesDto(service));
            }
            return result;
        }
    }
}
