using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SportHub.Models
{
    public class FieldImages
    {
        [Key]
        public Guid Id { get; set; }
        [Required]
        public Guid FieldId {  get; set; }
        [ForeignKey(nameof(FieldId))]
        public virtual Fields Fields { get; set; }
        [Required]
        public string Url { get; set; }
    }
}
