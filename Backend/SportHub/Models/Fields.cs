using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SportHub.Models
{
    public class Fields
    {
        [Key]
        public Guid Id { get; set; }
        [Required]
        public Guid SportCenterId { get; set; }
        [ForeignKey(nameof(SportCenterId))]
        public virtual SportCenters SportCenter { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Type { get; set; }
        [Required]
        public double PricePerSlot { get; set; }
        public string Status { get; set; }
        public string? Description { get; set; }
        public DateTime CreatedAt { get; set; }  = DateTime.Now;
    }
}
