using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SportHub.Models
{
    public class SportCenterImages
    {
        [Key]
        public Guid Id { get; set; }
        [Required]
        public Guid SportCenterId {  get; set; }
        [ForeignKey(nameof(SportCenterId))]
        [System.Text.Json.Serialization.JsonIgnore]
        public virtual SportCenters sportCenter { get; set; }
        [Required]
        public string Url { get; set; }
        public SportCenterImages()
        {
            Id = Guid.NewGuid();
        }
    }
}
