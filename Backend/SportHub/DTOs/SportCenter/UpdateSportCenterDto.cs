using SportHub.Models;
using System.ComponentModel.DataAnnotations;

namespace SportHub.DTOs.SportCenter
{
    public class UpdateSportCenterDto
    {
        [StringLength(100)]
        public string Name { get; set; }
        public string Address { get; set; }
        public string? Description { get; set; }
        public List<SportCenterImageDto>? images { get; set; }
    }
}