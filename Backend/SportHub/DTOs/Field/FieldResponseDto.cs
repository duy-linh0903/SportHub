using System.ComponentModel.DataAnnotations;

namespace SportHub.DTOs.Field
{
    public class FieldResponseDto
    {
        public Guid FieldId { get; set; }
        public Guid SportCenterId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public double PricePerSlot { get; set; }
        public string Status { get; set; } = string.Empty;
        public string? Description { get; set; }
        public List<FieldImageDto> Images { get; set; } = new List<FieldImageDto>();
    }
}
