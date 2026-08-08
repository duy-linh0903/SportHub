using SportHub.Models;
using System.ComponentModel.DataAnnotations;

namespace SportHub.DTOs.Service
{
    public class CreateServiceDto
    {
        [Required]
        public string Name { get; set; }
        [Required, Range(0, double.MaxValue)]
        public double Price { get; set; }
        [Required, StringLength(50)]
        public string Type { get; set; }
        public string? Description { get; set; }
    }
}
