using System.ComponentModel.DataAnnotations;

namespace SportHub.DTOs.Service
{
    public class ServiceResponseDto
    {
        public Guid ServiceId { get; set; }
        [Required, StringLength(100)]
        public string Name { get; set; }
        [Required, Range(0, double.MaxValue)]
        public double Price { get; set; }
        public string Type { get; set; }
        public string? Description { get; set; }
        public Guid? SportCenterId { get; set; }
    }
}
