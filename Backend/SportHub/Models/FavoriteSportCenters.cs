using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SportHub.Models
{
    public class FavoriteSportCenters
    {
        [Key]
        public Guid Id { get; set; }

        public Guid UserId { get; set; }
        public Guid SportCenterId { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("UserId")]
        public virtual Users? User { get; set; }

        [ForeignKey("SportCenterId")]
        public virtual SportCenters? SportCenter { get; set; }
    }
}
