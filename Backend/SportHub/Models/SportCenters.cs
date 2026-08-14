using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SportHub.Models
{
    public enum SportCenterStatus
    {
        Active = 0,
        Inactive = 1,
        Deleted = 2
    }

    public class SportCenters
    {
        [Key]
        public Guid Id { get; set; }
        [Required, StringLength(100)]
        public string Name { get; set; }
        [Required]
        public string Address { get; set; }
        public string? Description { get; set; }
        public SportCenterStatus Status { get; set; }
        public DateTime CreatedAt {  get; set; }
        [InverseProperty("sportCenter")]
        public virtual ICollection<SportCenterImages> Images { get; set; }
        [InverseProperty("SportCenter")]
        public virtual ICollection<Fields> Fields { get; set; }
        
        public Guid? OwnerId { get; set; }
        [ForeignKey(nameof(OwnerId))]
        public virtual Users Owner { get; set; }
        
        public SportCenters()
        {
            Id = Guid.NewGuid();
            CreatedAt = DateTime.Now;
        }
    }
}
