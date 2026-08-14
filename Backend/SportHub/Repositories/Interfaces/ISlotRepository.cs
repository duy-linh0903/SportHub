using SportHub.DTOs.Slots;

namespace SportHub.Repositories.Interfaces
{
    public interface ISlotRepository
    {
        Task<List<TimeSlotResponseDto>> GetTimeSlotByDateAsync(SlotRequestDto request);
        Task<List<SportHub.Models.TimeSlots>> GetTimeSlotsBySportCenterAsync(Guid sportCenterId);
        Task<SportHub.Models.TimeSlots> CreateTimeSlotAsync(SportHub.Models.TimeSlots timeSlot);
        Task UpdateTimeSlotAsync(SportHub.Models.TimeSlots timeSlot);
        Task DeleteTimeSlotAsync(Guid id);
        Task<SportHub.Models.TimeSlots?> GetTimeSlotByIdAsync(Guid id);
    }
}
