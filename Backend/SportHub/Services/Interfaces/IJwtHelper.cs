using SportHub.Models;

namespace SportHub.Services.Interfaces
{
    public interface IJwtHelper
    {
        string GenerateJwtToken(Users user);
    }
}
