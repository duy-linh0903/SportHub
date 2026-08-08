using SportHub.DTOs.Slots;

namespace SportHub.Repositories.Interfaces
{
    public interface ISlotRepository
    {
        Task<List<TimeSlotResponseDto>> GetTimeSlotByDateAsync(SlotRequestDto request);
    }
}
