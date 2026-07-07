using System.ComponentModel.DataAnnotations;

namespace SportHub.DTOs.Field
{
    public class UpdateFieldDto
    {
        [StringLength(100)]
        public string Name { get; set; }
        [StringLength(50)]
        public string Type { get; set; }
        public string? Description { get; set; }
        [Range(0, double.MaxValue)]
        public double PricePerSlot { get; set; }
        public List<FieldImageDto>? Images { get; set; }
    }
}
