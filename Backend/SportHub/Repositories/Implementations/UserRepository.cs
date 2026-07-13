using Microsoft.EntityFrameworkCore;
using SportHub.Data;
using SportHub.Models;
using SportHub.Repositories.Interfaces;

namespace SportHub.Repositories.Implementations
{
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _context;

        public UserRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Users>> GetAllAsync()
        {
            var results = await _context.Users.ToListAsync();
            return results;
        }

        public async Task<Users?> GetByIdAsync(Guid id)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
        }

        public async Task AddAsync(Users registerUser)
        {
            await _context.Users.AddAsync(registerUser);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Users updateUser)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == updateUser.Id);
            if (user != null)
            {
                user.Name = updateUser.Name;
                user.PhoneNumber = updateUser.PhoneNumber;
                await _context.SaveChangesAsync();
            }
            ;
        }

        public async Task DeleteAsync(Guid id)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
            if (user!=null)
            {
                user.Status = "Deleted";
                await _context.SaveChangesAsync();
            }
        }
    }
}
