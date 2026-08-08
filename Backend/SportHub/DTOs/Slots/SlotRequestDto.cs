using System.ComponentModel.DataAnnotations;

namespace SportHub.DTOs.Slots
{
    public class SlotRequestDto
    {
        [Required]
        public Guid fieldId { get; set; }
        [Required]
        public DateOnly date {  get; set; }
    }
}
