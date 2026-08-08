using SportHub.DTOs.Field;
using SportHub.DTOs.SportCenter;
using SportHub.Models;
using SportHub.Repositories.Interfaces;
using SportHub.Services.Interfaces;

namespace SportHub.Services.Implementations
{
    public class FieldService : IFieldService
    {
        private readonly IFieldRepository _fieldRepository;
        public FieldService(IFieldRepository fieldRepository)
        {
            _fieldRepository = fieldRepository;
        }

        public async Task<List<FieldResponseDto>> GetAllFieldsAsync()
        {
            var fieldList = await _fieldRepository.GetAllAsync();
            var result = new List<FieldResponseDto>();
            foreach (var field in fieldList)
            {
                result.Add(new FieldResponseDto
                {
                    FieldId = field.Id,
                    Name = field.Name,
                    Type = field.Type,
                    PricePerSlot = field.PricePerSlot
                });
            }
            return result;
        }

        public async Task<FieldResponseDto?> GetFieldByIdAsync(Guid id)
        {
            var field = await _fieldRepository.GetByIdAsync(id);
            if (field==null)
            {
                throw new KeyNotFoundException("Field isn't found");
            }
            return new FieldResponseDto
            {
                FieldId = field.Id,
                Name = field.Name,
                Type = field.Type,
                PricePerSlot = field.PricePerSlot
            };
        }

        public async Task<FieldResponseDto> CreateFieldAsync(CreateFieldDto fieldDto)
        {
            var field = new Fields
            {
                SportCenterId = fieldDto.SportCenterId,
                Name = fieldDto.Name,
                Type = fieldDto.Type,
                PricePerSlot = fieldDto.PricePerSlot
            };
            await _fieldRepository.AddAsync(field);
            return new FieldResponseDto
            {
                FieldId = field.Id,
                Name = field.Name,
                Type = field.Type,
                PricePerSlot = field.PricePerSlot
            };
        }

        public async Task<FieldResponseDto?> UpdateFieldAsync(Guid id, UpdateFieldDto fieldDto)
        {
            var field = await _fieldRepository.GetByIdAsync(id);
            if (field==null)
            {
                throw new KeyNotFoundException("Field isn't found");
            }
            field.Name = fieldDto.Name;
            field.Type = fieldDto.Type;
            field.PricePerSlot = fieldDto.PricePerSlot;
            await _fieldRepository.UpdateAsync(field);
            return new FieldResponseDto
            {
                FieldId = field.Id,
                Name = field.Name,
                Type = field.Type,
                PricePerSlot = field.PricePerSlot
            };
        }

        public async Task DeleteFieldAsync(Guid id)
        {
            var field = await _fieldRepository.GetByIdAsync(id);
            if (field == null)
            {
                throw new KeyNotFoundException("Field isn't found");
            }
            await _fieldRepository.DeleteAsync(field);
        }

        public async Task<List<FieldResponseDto>> GetFieldsBySportCenterAsync(Guid sportCenterId)
        {
            var fieldList = await _fieldRepository.GetBySportCenterId(sportCenterId);
            return FieldToDto(fieldList);
        }

        public async Task<List<FieldResponseDto>> GetFieldsByTypeAsync(string type)
        {
            var fieldList = await _fieldRepository.GetByType(type);
            return FieldToDto(fieldList);
        }

        public async Task<List<FieldResponseDto>> GetFieldsByPriceRangeAsync(double minPrice, double maxPrice)
        {
            var fieldList = await _fieldRepository.GetByPriceRange(minPrice, maxPrice);
            return FieldToDto(fieldList);
        }

        public List<FieldResponseDto> FieldToDto(List<Fields> fieldList)
        {
            var result = new List<FieldResponseDto>();
            foreach (var field in fieldList)
            {
                result.Add(new FieldResponseDto
                {
                    FieldId = field.Id,
                    Name = field.Name,
                    Type = field.Type,
                    PricePerSlot = field.PricePerSlot
                });
            }
            return result;
        }
    }
}
