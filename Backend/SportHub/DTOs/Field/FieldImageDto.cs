using System.ComponentModel.DataAnnotations;

namespace SportHub.DTOs.Field
{
    public class FieldImageDto
    {
        [Required]
        public string Url { get; set; }
    }
}