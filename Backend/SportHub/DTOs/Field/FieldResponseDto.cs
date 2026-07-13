using System.ComponentModel.DataAnnotations;

namespace SportHub.DTOs.Field
{
    public class FieldResponseDto
    {
        public Guid FieldId { get; set; }
        public Guid SportCenterId { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        public double PricePerSlot { get; set; }
        public string Status { get; set; }
        public string? Description { get; set; }
        public List<FieldImageDto> Images { get; set; } = new List<FieldImageDto>();
    }
}
