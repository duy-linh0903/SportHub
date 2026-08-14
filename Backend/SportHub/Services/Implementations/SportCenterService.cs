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
                    MinPrice = sc.Fields != null && sc.Fields.Any() ? sc.Fields.Min(f => f.PricePerSlot) : 0,
                    Status = sc.Status.ToString()
                });
            }
            return result;
        }

        public async Task<SportCenterResponseDto?> GetSportCenterByIdAsync(Guid id)
        {
            var sportCenter = await _sportCenter.GetByIdAsync(id);
            if (sportCenter==null)
            {
                throw new KeyNotFoundException("Sport Center isn't found");
            }
            return new SportCenterResponseDto
            {
                SportCenterId = sportCenter.Id,
                Name = sportCenter.Name,
                Address = sportCenter.Address,
                Description = sportCenter.Description,
                CreatedAt = sportCenter.CreatedAt,
                images = sportCenter.Images?.ToList(),
                Status = sportCenter.Status.ToString()
            };
        }

        public async Task<SportCenterResponseDto> CreateSportCenterAsync(CreateSportCenterDto sportCenterDto)
        {
            var sportCenter = new SportCenters
            {
                Name = sportCenterDto.Name,
                Address = sportCenterDto.Address,
                Description = sportCenterDto.Description,
                Images = sportCenterDto.images?.Select(i => new SportCenterImages { Url = i.Url }).ToList()
            };
            await _sportCenter.AddAsync(sportCenter);
            return new SportCenterResponseDto
            {
                SportCenterId = sportCenter.Id,
                Name = sportCenter.Name,
                Address = sportCenter.Address,
                Description = sportCenter.Description,
                CreatedAt = sportCenter.CreatedAt,
                images = sportCenter.Images?.ToList(),
                Status = sportCenter.Status.ToString()
            };
        }

        public async Task<SportCenterResponseDto?> UpdateSportCenterAsync(Guid id, UpdateSportCenterDto sportCenterDto)
        {
            var sportCenter = await _sportCenter.GetByIdAsync(id);
            if (sportCenter == null)
            {
                throw new KeyNotFoundException("Sport center isn't found");
            }
            var updateSport = new SportCenters
            {
                Id = id,
                Name = sportCenterDto.Name,
                Address = sportCenterDto.Address,
                Description = sportCenterDto.Description,
                Images = sportCenterDto.images?.Select(i => new SportCenterImages { Url = i.Url }).ToList()
            };
            await _sportCenter.UpdateAsync(updateSport);
            
            // Re-fetch to get updated values including standard formatting if any
            var updated = await _sportCenter.GetByIdAsync(id);
            return new SportCenterResponseDto
            {
                SportCenterId = updated.Id,
                Name = updated.Name,
                Address = updated.Address,
                Description = updated.Description,
                CreatedAt = updated.CreatedAt,
                images = updated.Images?.ToList(),
                Status = updated.Status.ToString()
            };
        }

        public async Task DeleteSportCenterAsync(Guid id)
        {
            await _sportCenter.DeleteAsync(id);
        }

        public async Task RestoreSportCenterAsync(Guid id)
        {
            await _sportCenter.RestoreAsync(id);
        }

        public async Task<List<SportCenterResponseDto>> SearchSportCentersAsync(string name)
        {
            var sportCenter = await _sportCenter.SearchAsync(name);
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
                    images = sport.Images?.ToList(),
                    Status = sport.Status.ToString()
                });
            }
            return result;
        }

        public async Task<List<SportCenterResponseDto>> GetSportCentersByOwnerIdAsync(Guid ownerId)
        {
            var sportCenter = await _sportCenter.GetByOwnerIdAsync(ownerId);
            var result = new List<SportCenterResponseDto>();
            foreach (var sc in sportCenter)
            {
                result.Add(new SportCenterResponseDto
                {
                    SportCenterId = sc.Id,
                    Name = sc.Name,
                    Address = sc.Address,
                    Description = sc.Description,
                    CreatedAt = sc.CreatedAt,
                    images = sc.Images?.ToList(),
                    MinPrice = sc.Fields != null && sc.Fields.Any() ? sc.Fields.Min(f => f.PricePerSlot) : 0,
                    Status = sc.Status.ToString()
                });
            }
            return result;
        }
    }
}
