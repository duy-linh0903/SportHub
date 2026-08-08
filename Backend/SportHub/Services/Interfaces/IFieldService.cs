using SportHub.DTOs.Field;

namespace SportHub.Services.Interfaces
{
    public interface IFieldService
    {
        Task<List<FieldResponseDto>> GetAllFieldsAsync();
        Task<FieldResponseDto?> GetFieldByIdAsync(Guid id);
        Task<FieldResponseDto> CreateFieldAsync(CreateFieldDto fieldDto);
        Task<FieldResponseDto?> UpdateFieldAsync(Guid id, UpdateFieldDto fieldDto);
        Task DeleteFieldAsync(Guid id);
        Task<List<FieldResponseDto>> GetFieldsBySportCenterAsync(Guid sportCenterId);
        Task<List<FieldResponseDto>> GetFieldsByTypeAsync(string type);
        Task<List<FieldResponseDto>> GetFieldsByPriceRangeAsync(double minPrice, double maxPrice);
    }
}
