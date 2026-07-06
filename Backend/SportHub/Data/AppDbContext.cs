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
        public DbSet<Services> Services { get; set; }
        public DbSet<Bookings> Bookings { get; set; }
        public DbSet<BookingServices> BookingServices { get; set; }
        public DbSet<TimeSlots> TimeSlots { get; set; }
        public DbSet<BookingSlots> BookingSlots { get; set; }
        public DbSet<Reviews> Reviews { get; set; }

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
                .WithMany()
                .HasForeignKey(f => f.SportCenterId);

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
                .WithMany()
                .HasForeignKey(bs => bs.BookingId);

            modelBuilder.Entity<BookingSlots>()
                .HasOne(bs => bs.TimeSlots)
                .WithMany()
                .HasForeignKey(bs => bs.SlotId);

            modelBuilder.Entity<Reviews>()
                .HasOne(r => r.Users)
                .WithMany()
                .HasForeignKey(r => r.UserId);

            modelBuilder.Entity<Reviews>()
                .HasOne(r => r.Fields)
                .WithMany()
                .HasForeignKey(r => r.FieldId);

            modelBuilder.Entity<Reviews>()
                .HasOne(r => r.Bookings)
                .WithMany()
                .HasForeignKey(r => r.BookingId);

            modelBuilder.Entity<Bookings>()
                .Property<Guid>("SlotId");

            modelBuilder.Entity<Bookings>()
                .HasIndex("FieldId", "BookingDate", "SlotId")
                .IsUnique();
        }
    }
}
