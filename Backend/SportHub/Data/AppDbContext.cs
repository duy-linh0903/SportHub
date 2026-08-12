using Microsoft.EntityFrameworkCore;
using SportHub.Models;

namespace SportHub.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Users> Users { get; set; }
        public DbSet<Roles> Roles { get; set; }
        public DbSet<UserRoles> UserRoles { get; set; }
        public DbSet<SportCenters> SportCenters { get; set; }
        public DbSet<Fields> Fields { get; set; }
        public DbSet<ServiceItem> ServiceItem { get; set; }
        public DbSet<Bookings> Bookings { get; set; }
        public DbSet<BookingServices> BookingServices { get; set; }
        public DbSet<TimeSlots> TimeSlots { get; set; }
        public DbSet<BookingSlots> BookingSlots { get; set; }
        public DbSet<Reviews> Reviews { get; set; }
        public DbSet<SportCenterImages> SportCenterImages { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<UserRoles>()
                .HasKey(ur => new { ur.UserId, ur.RoleId });

            modelBuilder.Entity<BookingSlots>()
                .HasKey(bs => new { bs.BookingId, bs.SlotId });

            modelBuilder.Entity<UserRoles>()
                .HasOne(ur => ur.User)
                .WithMany()
                .HasForeignKey(ur => ur.UserId);

            modelBuilder.Entity<UserRoles>()
                .HasOne(ur => ur.Roles)
                .WithMany()
                .HasForeignKey(ur => ur.RoleId);

            modelBuilder.Entity<Fields>()
                .HasOne(f => f.SportCenter)
                .WithMany(s => s.Fields)
                .HasForeignKey(f => f.SportCenterId);

            modelBuilder.Entity<Bookings>()
                .Property(b => b.Status)
                .HasConversion<string>();

            modelBuilder.Entity<Fields>()
                .Property(f => f.Status)
                .HasConversion<string>();

            modelBuilder.Entity<ServiceItem>()
                .Property(s => s.Status)
                .HasConversion<string>();

            modelBuilder.Entity<SportCenters>()
                .Property(s => s.Status)
                .HasConversion<string>();

            modelBuilder.Entity<Users>()
                .Property(u => u.Status)
                .HasConversion<string>();

            modelBuilder.Entity<Bookings>()
                .HasOne(b => b.User)
                .WithMany()
                .HasForeignKey(b => b.UserId);

            modelBuilder.Entity<Bookings>()
                .HasOne(b => b.Fields)
                .WithMany()
                .HasForeignKey(b => b.FieldId);

            modelBuilder.Entity<BookingServices>()
                .HasOne(bs => bs.Bookings)
                .WithMany()
                .HasForeignKey(bs => bs.BookingId);

            modelBuilder.Entity<BookingServices>()
                .HasOne(bs => bs.Services)
                .WithMany()
                .HasForeignKey(bs => bs.ServiceId);

            modelBuilder.Entity<BookingSlots>()
                .HasOne(bs => bs.Bookings)
                .WithMany(b => b.BookingSlots)
                .HasForeignKey(bs => bs.BookingId);

            modelBuilder.Entity<BookingSlots>()
                .HasOne(bs => bs.TimeSlots)
                .WithMany()
                .HasForeignKey(bs => bs.SlotId);

            modelBuilder.Entity<Reviews>()
                .HasOne(r => r.Users)
                .WithMany()
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Reviews>()
                .HasOne(r => r.SportCenters)
                .WithMany()
                .HasForeignKey(r => r.SportCenterId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Reviews>()
                .HasOne(r => r.Bookings)
                .WithMany()
                .HasForeignKey(r => r.BookingId);

            var adminRoleId = Guid.Parse("00000000-0000-0000-0000-000000000002");
            var userRoleId = Guid.Parse("00000000-0000-0000-0000-000000000001");

            var adminUserId = Guid.Parse("00000000-0000-0000-0000-000000000010");
            var normalUserId = Guid.Parse("00000000-0000-0000-0000-000000000011");

            var sportCenter1Id = Guid.Parse("00000000-0000-0000-0000-000000000100");
            var sportCenter2Id = Guid.Parse("00000000-0000-0000-0000-000000000101");

            var field1Id = Guid.Parse("00000000-0000-0000-0000-000000000200");
            var field2Id = Guid.Parse("00000000-0000-0000-0000-000000000201");
            var field3Id = Guid.Parse("00000000-0000-0000-0000-000000000202");

            var service1Id = Guid.Parse("00000000-0000-0000-0000-000000000300");
            var service2Id = Guid.Parse("00000000-0000-0000-0000-000000000301");
            var service3Id = Guid.Parse("00000000-0000-0000-0000-000000000302");
            var service4Id = Guid.Parse("00000000-0000-0000-0000-000000000303");

            var timeSlotSeedData = Enumerable.Range(0, 14).Select(index => new TimeSlots
            {
                Id = Guid.Parse($"00000000-0000-0000-0000-{(0x400 + index).ToString("x12")}"),
                StartTime = new TimeOnly(7 + index, 0),
                EndTime = new TimeOnly(8 + index, 0)
            }).ToArray();

            var booking1Id = Guid.Parse("00000000-0000-0000-0000-000000000500");
            var booking2Id = Guid.Parse("00000000-0000-0000-0000-000000000501");

            var bookingService1Id = Guid.Parse("00000000-0000-0000-0000-000000000600");
            var bookingService2Id = Guid.Parse("00000000-0000-0000-0000-000000000601");
            var bookingService3Id = Guid.Parse("00000000-0000-0000-0000-000000000602");

            var review1Id = Guid.Parse("00000000-0000-0000-0000-000000000700");

            var image1Id = Guid.Parse("00000000-0000-0000-0000-000000000800");
            var image2Id = Guid.Parse("00000000-0000-0000-0000-000000000801");

            modelBuilder.Entity<Roles>().HasData(
                new Roles
                {
                    Id = adminRoleId,
                    RoleName = "Admin"
                },
                new Roles
                {
                    Id = userRoleId,
                    RoleName = "User"
                }
            );

            modelBuilder.Entity<Users>().HasData(
                new Users
                {
                    Id = adminUserId,
                    Name = "Admin",
                    PhoneNumber = "0123456789",
                    Email = "admin@sporthub.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                    AvatarUrl = string.Empty,
                    Status = UserStatus.Active,
                    CreatedAt = DateTime.Parse("2026-08-05T00:00:00")
                },
                new Users
                {
                    Id = normalUserId,
                    Name = "User",
                    PhoneNumber = "0987654321",
                    Email = "user@sporthub.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("User@123"),
                    AvatarUrl = string.Empty,
                    Status = UserStatus.Active,
                    CreatedAt = DateTime.Parse("2026-08-05T00:00:00")
                }
            );

            modelBuilder.Entity<UserRoles>().HasData(
                new UserRoles { UserId = adminUserId, RoleId = adminRoleId },
                new UserRoles { UserId = normalUserId, RoleId = userRoleId }
            );

            modelBuilder.Entity<SportCenters>().HasData(
                new SportCenters
                {
                    Id = sportCenter1Id,
                    Name = "Champions Arena",
                    Address = "123 Nguyễn Huệ, Quận 1",
                    Description = "Sân thể thao hiện đại, phù hợp cho bóng đá và cầu lông.",
                    Status = SportCenterStatus.Active,
                    CreatedAt = DateTime.Parse("2026-08-05T00:00:00")
                },
                new SportCenters
                {
                    Id = sportCenter2Id,
                    Name = "Elite Sports Hub",
                    Address = "456 Lê Văn Sỹ, Quận 3",
                    Description = "Trung tâm thể thao đa năng với nhiều loại sân.",
                    Status = SportCenterStatus.Active,
                    CreatedAt = DateTime.Parse("2026-08-05T00:00:00")
                }
            );

            modelBuilder.Entity<Fields>().HasData(
                new Fields
                {
                    Id = field1Id,
                    SportCenterId = sportCenter1Id,
                    Name = "Sân 1",
                    Type = "Badminton",
                    PricePerSlot = 120000,
                    Status = FieldStatus.Active,
                    CreatedAt = DateTime.Parse("2026-08-05T00:00:00")
                },
                new Fields
                {
                    Id = field2Id,
                    SportCenterId = sportCenter1Id,
                    Name = "Sân 2",
                    Type = "Football",
                    PricePerSlot = 250000,
                    Status = FieldStatus.Active,
                    CreatedAt = DateTime.Parse("2026-08-05T00:00:00")
                },
                new Fields
                {
                    Id = field3Id,
                    SportCenterId = sportCenter2Id,
                    Name = "Sân 3",
                    Type = "Tennis",
                    PricePerSlot = 180000,
                    Status = FieldStatus.Active,
                    CreatedAt = DateTime.Parse("2026-08-05T00:00:00")
                }
            );

            modelBuilder.Entity<ServiceItem>().HasData(
                new ServiceItem
                {
                    Id = service1Id,
                    Name = "Đá bóng",
                    Price = 50000,
                    Type = "Equipment",
                    Description = "Dịch vụ thuê bóng",
                    Status = ServiceStatus.Active
                },
                new ServiceItem
                {
                    Id = service2Id,
                    Name = "Cầu lông",
                    Price = 30000,
                    Type = "Equipment",
                    Description = "Dịch vụ thuê vợt và shuttlecock",
                    Status = ServiceStatus.Active
                },
                new ServiceItem
                {
                    Id = service3Id,
                    Name = "Tư vấn huấn luyện",
                    Price = 150000,
                    Type = "Coach",
                    Description = "Buổi tư vấn kỹ thuật",
                    Status = ServiceStatus.Active
                },
                new ServiceItem
                {
                    Id = service4Id,
                    Name = "Phòng thay đồ",
                    Price = 20000,
                    Type = "Facility",
                    Description = "Sử dụng phòng thay đồ",
                    Status = ServiceStatus.Active
                }
            );

            modelBuilder.Entity<TimeSlots>().HasData(timeSlotSeedData);

            modelBuilder.Entity<Bookings>().HasData(
                new Bookings
                {
                    Id = booking1Id,
                    UserId = normalUserId,
                    FieldId = field1Id,
                    BookingDate = DateOnly.Parse("2026-08-10"),
                    TotalPrice = 240000,
                    Status = BookingStatus.Confirmed,
                    CheckInCode = "CHK001",
                    CreatedAt = DateTime.Parse("2026-08-05T10:00:00")
                },
                new Bookings
                {
                    Id = booking2Id,
                    UserId = normalUserId,
                    FieldId = field2Id,
                    BookingDate = DateOnly.Parse("2026-08-11"),
                    TotalPrice = 500000,
                    Status = BookingStatus.Pending,
                    CheckInCode = "CHK002",
                    CreatedAt = DateTime.Parse("2026-08-05T11:30:00")
                }
            );

            modelBuilder.Entity<BookingServices>().HasData(
                new BookingServices
                {
                    Id = bookingService1Id,
                    BookingId = booking1Id,
                    ServiceId = service1Id,
                    Quantity = 2,
                    Price = 100000
                },
                new BookingServices
                {
                    Id = bookingService2Id,
                    BookingId = booking1Id,
                    ServiceId = service2Id,
                    Quantity = 1,
                    Price = 30000
                },
                new BookingServices
                {
                    Id = bookingService3Id,
                    BookingId = booking2Id,
                    ServiceId = service3Id,
                    Quantity = 1,
                    Price = 150000
                }
            );

            modelBuilder.Entity<BookingSlots>().HasData(
                new BookingSlots { BookingId = booking1Id, SlotId = timeSlotSeedData[3].Id },
                new BookingSlots { BookingId = booking2Id, SlotId = timeSlotSeedData[4].Id }
            );

            modelBuilder.Entity<Reviews>().HasData(
                new Reviews
                {
                    Id = review1Id,
                    UserId = normalUserId,
                    SportCenterId = sportCenter1Id,
                    BookingId = booking1Id,
                    Rating = 5,
                    Comment = "Sân rất đẹp và dễ đặt lịch.",
                    CreatedAt = DateTime.Parse("2026-08-06T00:00:00")
                }
            );

            modelBuilder.Entity<SportCenterImages>().HasData(
                new SportCenterImages { Id = image1Id, SportCenterId = sportCenter1Id, Url = "https://example.com/images/champions-arena-1.jpg" },
                new SportCenterImages { Id = image2Id, SportCenterId = sportCenter2Id, Url = "https://example.com/images/elite-sports-hub-1.jpg" }
            );
        }
    }
}
