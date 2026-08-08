using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SportHub.Models
{
    public enum FieldStatus
    {
        Active = 0,
        Inactive = 1,
        Deleted = 2
    }

    public class Fields
    {
        [Key]
        public Guid Id { get; set; }
        [Required]
        public Guid SportCenterId { get; set; }
        [ForeignKey(nameof(SportCenterId))]
        public virtual SportCenters SportCenter { get; set; }
        [Required, StringLength(50)]
        public string Name { get; set; }
        [Required,StringLength(50)]
        public string Type { get; set; }
        [Required]
        public double PricePerSlot { get; set; }
        public FieldStatus Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public Fields()
        {
            Id = Guid.NewGuid();
            CreatedAt = DateTime.Now;
        }
    }
}
