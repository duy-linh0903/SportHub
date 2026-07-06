using System.ComponentModel.DataAnnotations;

namespace SportHub.Models
{
    public class Services
    {
        [Key]
        public Guid Id {  get; set; }
        [Required] 
        public string Name { get; set; }
        [Required, Range(0,double.MaxValue)]
        public string Price { get; set; }
        public string? Description { get; set; }    
    }
}
