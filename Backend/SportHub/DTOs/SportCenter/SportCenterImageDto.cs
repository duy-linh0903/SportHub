using System.ComponentModel.DataAnnotations;

namespace SportHub.DTOs.SportCenter
{
    public class SportCenterImageDto
    {
        [Required]
        public string Url { get; set; }
    }
}
