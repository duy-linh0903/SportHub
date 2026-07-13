using System.ComponentModel.DataAnnotations;

namespace SportHub.DTOs.Field
{
    public class UpdateFieldDto
    {
        [Required]
        public Guid SportCenterId { get; set; }
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
