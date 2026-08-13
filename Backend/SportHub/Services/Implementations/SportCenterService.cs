using SportHub.DTOs.SportCenter;
using SportHub.Models;
using SportHub.Repositories.Interfaces;
using SportHub.Services.Interfaces;

namespace SportHub.Services.Implementations
{
    public class SportCenterService : ISportCenterService
    {
        private readonly ISportCenterRepository _sportCenter;

        public SportCenterService(ISportCenterRepository sportCenter)
        {
            _sportCenter = sportCenter;
        }

        public async Task<List<SportCenterResponseDto>> GetAllSportCentersAsync()
        {
            var sportCenter = await _sportCenter.GetAllAsync();
            var result = new List<SportCenterResponseDto>();
            foreach(var sc in sportCenter)
            {
                result.Add(new SportCenterResponseDto
                {
                    SportCenterId = sc.Id,
                    Name = sc.Name,
                    Address = sc.Address,
                    Description = sc.Description,
                    CreatedAt = sc.CreatedAt,
                    images = sc.Images?.ToList(),
                    MinPrice = sc.Fields != null && sc.Fields.Any() ? sc.Fields.Min(f => f.PricePerSlot) : 0
                });
            }
            return result;
        }

        public async Task<SportCenterResponseDto?> GetSportCenterByIdAsync(Guid id)
        {
            var sportCenter = await _sportCenter.GetByIdAsync(id);
            if (sportCenter == null)
            {
                return null;
            }
            return new SportCenterResponseDto
            {
                SportCenterId = sportCenter.Id,
                Name = sportCenter.Name,
                Address = sportCenter.Address,
                Description = sportCenter.Description,
                CreatedAt = sportCenter.CreatedAt,
                images = sportCenter.Images?.ToList(),
                MinPrice = sportCenter.Fields != null && sportCenter.Fields.Any() ? sportCenter.Fields.Min(f => f.PricePerSlot) : 0
            };
        }

        public async Task<SportCenterResponseDto> CreateSportCenterAsync(CreateSportCenterDto sportCenterDto)
        {
            var sportCenter = new SportCenters
            {
                Name = sportCenterDto.Name,
                Address = sportCenterDto.Address,
                Description = sportCenterDto.Description,
                Images = sportCenterDto.images?.Select(image => new SportCenterImages
                {
                    Url = image.Url
                }).ToList() ?? new List<SportCenterImages>()
            };
            await _sportCenter.AddAsync(sportCenter);
            return new SportCenterResponseDto
            {
                SportCenterId = sportCenter.Id,
                Name = sportCenter.Name,
                Address = sportCenter.Address,
                Description = sportCenter.Description,
                CreatedAt = sportCenter.CreatedAt,
                images = sportCenter.Images?.ToList()
            };
        }

        public async Task<SportCenterResponseDto?> UpdateSportCenterAsync(Guid id, UpdateSportCenterDto sportCenterDto)
        {
            var sportCenter = await _sportCenter.GetByIdAsync(id);
            if (sportCenter == null)
            {
                throw new KeyNotFoundException("Sport center isn't found");
            }
            sportCenter.Name = sportCenterDto.Name;
            sportCenter.Address = sportCenterDto.Address;
            sportCenter.Description = sportCenterDto.Description;
            sportCenter.Images = sportCenterDto.images?.Select(image => new SportCenterImages
            {
                Url = image.Url,
                SportCenterId = id
            }).ToList() ?? sportCenter.Images ?? new List<SportCenterImages>();
            await _sportCenter.UpdateAsync(sportCenter);
            return new SportCenterResponseDto
            {
                SportCenterId = sportCenter.Id,
                Name = sportCenter.Name,
                Address = sportCenter.Address,
                Description = sportCenter.Description,
                CreatedAt = sportCenter.CreatedAt,
                images = sportCenter.Images?.ToList()
            };
        }

        public async Task DeleteSportCenterAsync(Guid id)
        {
            var sportCenter = await _sportCenter.GetByIdAsync(id);
            if ( sportCenter == null)
            {
                throw new KeyNotFoundException("Sport center isn't found");
            }
            await _sportCenter.DeleteAsync(id);
        }

        public async Task<List<SportCenterResponseDto>> SearchSportCentersAsync(string name)
        {
            var sportCenter = await _sportCenter.SearchByNameAsync(name);
            var result = new List<SportCenterResponseDto>();
            foreach (var sport in sportCenter)
            {
                result.Add(new SportCenterResponseDto
                {
                    SportCenterId = sport.Id,
                    Name = sport.Name,
                    Address = sport.Address,
                    Description= sport.Description,
                    CreatedAt = sport.CreatedAt,
                    images = sport.Images?.ToList()
                });
            }
            return result;
        }
    }
}
