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
        public DbSet<FavoriteSportCenters> FavoriteSportCenters { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<UserRoles>()
                .HasKey(ur => new { ur.UserId, ur.RoleId });

            modelBuilder.Entity<BookingSlots>()
                .HasKey(bs => new { bs.BookingId, bs.SlotId });

            modelBuilder.Entity<BookingSlots>()
                .HasIndex(bs => new { bs.BookingId, bs.SlotId })
                .IsUnique();

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

            modelBuilder.Entity<FavoriteSportCenters>()
                .HasOne(f => f.User)
                .WithMany()
                .HasForeignKey(f => f.UserId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<FavoriteSportCenters>()
                .HasOne(f => f.SportCenter)
                .WithMany()
                .HasForeignKey(f => f.SportCenterId)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }
}
