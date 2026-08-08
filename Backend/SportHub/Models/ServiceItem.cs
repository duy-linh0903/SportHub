using System.ComponentModel.DataAnnotations;

namespace SportHub.Models
{
    public enum ServiceStatus
    {
        Active = 0,
        Inactive = 1,
        Deleted = 2
    }

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
        public ServiceStatus Status { get; set; }
        public ServiceItem()
        {
            Id = Guid.NewGuid();
            Status = ServiceStatus.Active;
        }
    }
}
