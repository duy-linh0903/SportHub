using System.ComponentModel.DataAnnotations;

namespace SportHub.DTOs.Field
{
    public class CreateFieldDto
    {
        [Required]
        public Guid SportCenterId { get; set; }
        [Required, StringLength(100)]
        public string Name { get; set; }
        [Required, StringLength(50)]
        public string Type { get; set; }
        [Required,Range(0,double.MaxValue)]
        public double PricePerSlot { get; set; }
    }
}
