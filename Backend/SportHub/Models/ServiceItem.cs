using System.ComponentModel.DataAnnotations;

namespace SportHub.Models
{
    public class ServiceItem
    {
        [Key]
        public Guid Id {  get; set; }
        [Required,StringLength(50)] 
        public string Name { get; set; }
        [Required, Range(0,double.MaxValue)]
        public double Price { get; set; }
        [Required,StringLength(50)]
        public string Type { get; set; }
        public string? Description { get; set; }   
        public string Status { get; set; }
    }
}
