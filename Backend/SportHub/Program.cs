using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using SportHub.Data;
using SportHub.Models;
using SportHub.Repositories.Implementations;
using SportHub.Repositories.Interfaces;
using SportHub.Services.Implementations;
using SportHub.Services.Interfaces;
using System.Security.Claims;
using System.Text;
using SportHub.Hubs;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DBConnection")));

// Repositories
builder.Services.AddScoped<IBookingRepository, BookingRepository>();
builder.Services.AddScoped<IFieldRepository, FieldRepository>();
builder.Services.AddScoped<IReviewRepository, ReviewRepository>();
builder.Services.AddScoped<IServiceRepository, ServiceRepository>();
builder.Services.AddScoped<ISportCenterRepository, SportCenterRepository>();
builder.Services.AddScoped<ISlotRepository, SlotRepository>();
builder.Services.AddScoped<UserRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();

// Services
builder.Services.AddScoped<IBookingService, BookingService>();
builder.Services.AddScoped<IFieldService, FieldService>();
builder.Services.AddScoped<IReviewService, ReviewService>();
builder.Services.AddScoped<IServiceItemService, ServiceItemService>();
builder.Services.AddScoped<ISportCenterService, SportCenterService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IEmailService, SmtpEmailService>();
builder.Services.AddScoped<IJwtHelper, JwtHelper>();
builder.Services.AddMemoryCache();
builder.Services.AddHostedService<SportHub.Services.BackgroundServices.AutoCancelBookingService>();

// Add services to the container.
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder => builder
            .SetIsOriginAllowed(_ => true)
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials());
});
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
    });
builder.Services.AddSignalR();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
//builder.Services.AddSwaggerGen();
builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "Nhập JWT token vào đây (dạng: Bearer {token})",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});
// Thêm Authentication & JWT
var key = builder.Configuration["Jwt:Key"];
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        //Nếu hay bị lỗi 401 thì có thể chuyển ValidateIssuer và ValidateAudience thành false
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),
        RoleClaimType = ClaimTypes.Role
    };
    
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            var accessToken = context.Request.Query["access_token"];
            var path = context.HttpContext.Request.Path;
            if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/hubs/notifications"))
            {
                context.Token = accessToken;
            }
            return Task.CompletedTask;
        }
    };
});
builder.Services.AddAuthorization();
var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    var roles = new[]
    {
        new Roles { Id = Guid.Parse("00000000-0000-0000-0000-000000000001"), RoleName = "User" },
        new Roles { Id = Guid.Parse("00000000-0000-0000-0000-000000000002"), RoleName = "Admin" }
    };

    foreach (var role in roles)
    {
        if (!db.Roles.Any(r => r.RoleName == role.RoleName))
        {
            db.Roles.Add(role);
        }
    }

    db.SaveChanges();

    var adminEmail = "admin@sporthub.com";
    var normalUserEmail = "user@sporthub.com";
    if (!db.Users.Any(u => u.Email == adminEmail))
    {
        var adminUser = new Users
        {
            Id = Guid.Parse("00000000-0000-0000-0000-000000000010"),
            Name = "Admin",
            Email = adminEmail,
            PhoneNumber = "0123456789",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
            AvatarUrl = string.Empty,
            Status = UserStatus.Active,
            CreatedAt = DateTime.Parse("2026-08-05T00:00:00")
        };

        db.Users.Add(adminUser);
        db.SaveChanges();

        var adminRole = db.Roles.First(r => r.RoleName == "Admin");
        db.UserRoles.Add(new UserRoles
        {
            UserId = adminUser.Id,
            RoleId = adminRole.Id
        });
        db.SaveChanges();
    }

    if (!db.Users.Any(u => u.Email == normalUserEmail))
    {
        var normalUser = new Users
        {
            Id = Guid.Parse("00000000-0000-0000-0000-000000000011"),
            Name = "User",
            Email = normalUserEmail,
            PhoneNumber = "0987654321",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("User@123"),
            AvatarUrl = string.Empty,
            Status = UserStatus.Active,
            CreatedAt = DateTime.Parse("2026-08-05T00:00:00")
        };

        db.Users.Add(normalUser);
        db.SaveChanges();

        var userRole = db.Roles.First(r => r.RoleName == "User");
        db.UserRoles.Add(new UserRoles
        {
            UserId = normalUser.Id,
            RoleId = userRole.Id
        });
        db.SaveChanges();
    }

    var sportCenters = new[]
    {
        new SportCenters
        {
            Id = Guid.Parse("00000000-0000-0000-0000-000000000100"),
            Name = "Champions Arena",
            Address = "123 Nguyễn Huệ, Quận 1",
            Description = "Sân thể thao hiện đại, phù hợp cho bóng đá và cầu lông.",
            Status = SportCenterStatus.Active,
            CreatedAt = DateTime.Parse("2026-08-05T00:00:00")
        },
        new SportCenters
        {
            Id = Guid.Parse("00000000-0000-0000-0000-000000000101"),
            Name = "Elite Sports Hub",
            Address = "456 Lê Văn Sỹ, Quận 3",
            Description = "Trung tâm thể thao đa năng với nhiều loại sân.",
            Status = SportCenterStatus.Active,
            CreatedAt = DateTime.Parse("2026-08-05T00:00:00")
        },
        new SportCenters
        {
            Id = Guid.Parse("00000000-0000-0000-0000-000000000102"),
            Name = "Cụm sân bóng Chảo Lửa",
            Address = "30 Phan Thúc Duyện, Tân Bình, TP.HCM",
            Description = "Cụm sân cỏ nhân tạo siêu đẹp, chuyên tổ chức các giải phủi.",
            Status = SportCenterStatus.Active,
            CreatedAt = DateTime.Parse("2026-08-11T00:00:00")
        },
        new SportCenters { Id = Guid.Parse("00000000-0000-0000-0000-000000000103"), Name = "Basketball Hoop Dreams", Address = "10 Phạm Ngọc Thạch, Quận 3", Description = "Sân bóng rổ trong nhà đạt chuẩn thi đấu.", Status = SportCenterStatus.Active, CreatedAt = DateTime.Parse("2026-08-11T00:00:00") },
        new SportCenters { Id = Guid.Parse("00000000-0000-0000-0000-000000000104"), Name = "Sân Cầu Lông Kỳ Hòa", Address = "828 Sư Vạn Hạnh, Quận 10", Description = "Cụm 10 sân cầu lông thảm tiêu chuẩn.", Status = SportCenterStatus.Active, CreatedAt = DateTime.Parse("2026-08-11T00:00:00") },
        new SportCenters { Id = Guid.Parse("00000000-0000-0000-0000-000000000105"), Name = "Hồ bơi Yết Kiêu", Address = "1 Nguyễn Thị Minh Khai, Quận 1", Description = "Hồ bơi thi đấu dài 50m, nước trong vắt.", Status = SportCenterStatus.Active, CreatedAt = DateTime.Parse("2026-08-11T00:00:00") },
        new SportCenters { Id = Guid.Parse("00000000-0000-0000-0000-000000000106"), Name = "Trung tâm Bóng chuyền", Address = "123 An Dương Vương, Quận 5", Description = "Nhà thi đấu bóng chuyền có khán đài.", Status = SportCenterStatus.Active, CreatedAt = DateTime.Parse("2026-08-11T00:00:00") },
        new SportCenters { Id = Guid.Parse("00000000-0000-0000-0000-000000000107"), Name = "CLB Tennis Lan Anh", Address = "291 CMT8, Quận 10", Description = "Sân đất nện và sân cứng cao cấp.", Status = SportCenterStatus.Active, CreatedAt = DateTime.Parse("2026-08-11T00:00:00") },
        new SportCenters { Id = Guid.Parse("00000000-0000-0000-0000-000000000108"), Name = "Sân Golf Him Lam", Address = "234 Ngô Tất Tố, Bình Thạnh", Description = "Sân tập Golf (Driving Range) view sông Sài Gòn.", Status = SportCenterStatus.Active, CreatedAt = DateTime.Parse("2026-08-11T00:00:00") },
        new SportCenters { Id = Guid.Parse("00000000-0000-0000-0000-000000000109"), Name = "CLB Bóng bàn Hoa Lư", Address = "2 Đinh Tiên Hoàng, Quận 1", Description = "Nhiều bàn bóng bàn chất lượng, có robot bắn bóng.", Status = SportCenterStatus.Active, CreatedAt = DateTime.Parse("2026-08-11T00:00:00") }
    };

    var defaultAdminId = Guid.Parse("00000000-0000-0000-0000-000000000010");
    foreach (var sportCenter in sportCenters)
    {
        if (!db.SportCenters.Any(sc => sc.Id == sportCenter.Id || sc.Name == sportCenter.Name))
        {
            sportCenter.OwnerId = defaultAdminId;
            db.SportCenters.Add(sportCenter);
        }
    }
    db.SaveChanges();
    
    // Update existing sport centers without an owner
    var ownerlessCenters = db.SportCenters.Where(sc => sc.OwnerId == null).ToList();
    foreach (var center in ownerlessCenters)
    {
        center.OwnerId = defaultAdminId;
    }
    db.SaveChanges();

    var fields = new[]
    {
        new Fields { Id = Guid.Parse("00000000-0000-0000-0000-000000000200"), SportCenterId = Guid.Parse("00000000-0000-0000-0000-000000000100"), Name = "Sân 1", Type = "Badminton", PricePerSlot = 120000, Status = FieldStatus.Active, CreatedAt = DateTime.Parse("2026-08-05T00:00:00") },
        new Fields { Id = Guid.Parse("00000000-0000-0000-0000-000000000201"), SportCenterId = Guid.Parse("00000000-0000-0000-0000-000000000100"), Name = "Sân 2", Type = "Football", PricePerSlot = 250000, Status = FieldStatus.Active, CreatedAt = DateTime.Parse("2026-08-05T00:00:00") },
        new Fields { Id = Guid.Parse("00000000-0000-0000-0000-000000000202"), SportCenterId = Guid.Parse("00000000-0000-0000-0000-000000000101"), Name = "Sân 3", Type = "Tennis", PricePerSlot = 180000, Status = FieldStatus.Active, CreatedAt = DateTime.Parse("2026-08-05T00:00:00") },
        new Fields { Id = Guid.Parse("00000000-0000-0000-0000-000000000203"), SportCenterId = Guid.Parse("00000000-0000-0000-0000-000000000102"), Name = "Sân bóng 5 người - Số 1", Type = "Football", PricePerSlot = 300000, Status = FieldStatus.Active, CreatedAt = DateTime.Parse("2026-08-11T00:00:00") },
        new Fields { Id = Guid.Parse("00000000-0000-0000-0000-000000000204"), SportCenterId = Guid.Parse("00000000-0000-0000-0000-000000000102"), Name = "Sân bóng 7 người - Số 2", Type = "Football", PricePerSlot = 600000, Status = FieldStatus.Active, CreatedAt = DateTime.Parse("2026-08-11T00:00:00") },
        new Fields { Id = Guid.Parse("00000000-0000-0000-0000-000000000205"), SportCenterId = Guid.Parse("00000000-0000-0000-0000-000000000103"), Name = "Sân bóng rổ số 1", Type = "Basketball", PricePerSlot = 400000, Status = FieldStatus.Active, CreatedAt = DateTime.Parse("2026-08-11T00:00:00") },
        new Fields { Id = Guid.Parse("00000000-0000-0000-0000-000000000206"), SportCenterId = Guid.Parse("00000000-0000-0000-0000-000000000104"), Name = "Sân cầu lông A", Type = "Badminton", PricePerSlot = 150000, Status = FieldStatus.Active, CreatedAt = DateTime.Parse("2026-08-11T00:00:00") },
        new Fields { Id = Guid.Parse("00000000-0000-0000-0000-000000000207"), SportCenterId = Guid.Parse("00000000-0000-0000-0000-000000000105"), Name = "Làn bơi số 3", Type = "Swimming", PricePerSlot = 80000, Status = FieldStatus.Active, CreatedAt = DateTime.Parse("2026-08-11T00:00:00") },
        new Fields { Id = Guid.Parse("00000000-0000-0000-0000-000000000208"), SportCenterId = Guid.Parse("00000000-0000-0000-0000-000000000106"), Name = "Sân bóng chuyền chính", Type = "Volleyball", PricePerSlot = 300000, Status = FieldStatus.Active, CreatedAt = DateTime.Parse("2026-08-11T00:00:00") },
        new Fields { Id = Guid.Parse("00000000-0000-0000-0000-000000000209"), SportCenterId = Guid.Parse("00000000-0000-0000-0000-000000000107"), Name = "Sân đất nện 1", Type = "Tennis", PricePerSlot = 250000, Status = FieldStatus.Active, CreatedAt = DateTime.Parse("2026-08-11T00:00:00") },
        new Fields { Id = Guid.Parse("00000000-0000-0000-0000-000000000210"), SportCenterId = Guid.Parse("00000000-0000-0000-0000-000000000108"), Name = "Line tập số 10", Type = "Golf", PricePerSlot = 500000, Status = FieldStatus.Active, CreatedAt = DateTime.Parse("2026-08-11T00:00:00") },
        new Fields { Id = Guid.Parse("00000000-0000-0000-0000-000000000211"), SportCenterId = Guid.Parse("00000000-0000-0000-0000-000000000109"), Name = "Bàn bóng bàn VVIP", Type = "Table Tennis", PricePerSlot = 100000, Status = FieldStatus.Active, CreatedAt = DateTime.Parse("2026-08-11T00:00:00") }
    };

    foreach (var field in fields)
    {
        if (!db.Fields.Any(f => f.Id == field.Id || (f.Name == field.Name && f.SportCenterId == field.SportCenterId)))
        {
            db.Fields.Add(field);
        }
    }
    db.SaveChanges();

    var services = new[]
    {
        new ServiceItem { Id = Guid.Parse("00000000-0000-0000-0000-000000000300"), Name = "Đá bóng", Price = 50000, Type = "Equipment", Description = "Dịch vụ thuê bóng", Status = ServiceStatus.Active },
        new ServiceItem { Id = Guid.Parse("00000000-0000-0000-0000-000000000301"), Name = "Cầu lông", Price = 30000, Type = "Equipment", Description = "Dịch vụ thuê vợt và shuttlecock", Status = ServiceStatus.Active },
        new ServiceItem { Id = Guid.Parse("00000000-0000-0000-0000-000000000302"), Name = "Tư vấn huấn luyện", Price = 150000, Type = "Coach", Description = "Buổi tư vấn kỹ thuật", Status = ServiceStatus.Active },
        new ServiceItem { Id = Guid.Parse("00000000-0000-0000-0000-000000000303"), Name = "Phòng thay đồ", Price = 20000, Type = "Facility", Description = "Sử dụng phòng thay đồ", Status = ServiceStatus.Active }
    };

    foreach (var service in services)
    {
        if (!db.ServiceItem.Any(s => s.Id == service.Id || s.Name == service.Name))
        {
            db.ServiceItem.Add(service);
        }
    }
    db.SaveChanges();

    var timeSlots = Enumerable.Range(0, 14).Select(index => new TimeSlots
    {
        Id = Guid.Parse($"00000000-0000-0000-0000-{(0x400 + index).ToString("x12")}"),
        StartTime = new TimeOnly(7 + index, 0),
        EndTime = new TimeOnly(8 + index, 0)
    }).ToArray();

    foreach (var slot in timeSlots)
    {
        if (!db.TimeSlots.Any(s => s.Id == slot.Id || (s.StartTime == slot.StartTime && s.EndTime == slot.EndTime)))
        {
            db.TimeSlots.Add(slot);
        }
    }
    db.SaveChanges();

    var bookings = new[]
    {
        new Bookings { Id = Guid.Parse("00000000-0000-0000-0000-000000000500"), UserId = Guid.Parse("00000000-0000-0000-0000-000000000011"), FieldId = Guid.Parse("00000000-0000-0000-0000-000000000200"), BookingDate = DateOnly.Parse("2026-08-10"), TotalPrice = 240000, Status = BookingStatus.Confirmed, CheckInCode = "CHK001", CreatedAt = DateTime.Parse("2026-08-05T10:00:00") },
        new Bookings { Id = Guid.Parse("00000000-0000-0000-0000-000000000501"), UserId = Guid.Parse("00000000-0000-0000-0000-000000000011"), FieldId = Guid.Parse("00000000-0000-0000-0000-000000000201"), BookingDate = DateOnly.Parse("2026-08-11"), TotalPrice = 500000, Status = BookingStatus.Pending, CheckInCode = "CHK002", CreatedAt = DateTime.Parse("2026-08-05T11:30:00") }
    };

    foreach (var booking in bookings)
    {
        if (!db.Bookings.Any(b => b.Id == booking.Id || (b.UserId == booking.UserId && b.FieldId == booking.FieldId && b.BookingDate == booking.BookingDate)))
        {
            db.Bookings.Add(booking);
        }
    }
    db.SaveChanges();

    var bookingServices = new[]
    {
        new BookingServices { Id = Guid.Parse("00000000-0000-0000-0000-000000000600"), BookingId = Guid.Parse("00000000-0000-0000-0000-000000000500"), ServiceId = Guid.Parse("00000000-0000-0000-0000-000000000300"), Quantity = 2, Price = 100000 },
        new BookingServices { Id = Guid.Parse("00000000-0000-0000-0000-000000000601"), BookingId = Guid.Parse("00000000-0000-0000-0000-000000000500"), ServiceId = Guid.Parse("00000000-0000-0000-0000-000000000301"), Quantity = 1, Price = 30000 },
        new BookingServices { Id = Guid.Parse("00000000-0000-0000-0000-000000000602"), BookingId = Guid.Parse("00000000-0000-0000-0000-000000000501"), ServiceId = Guid.Parse("00000000-0000-0000-0000-000000000302"), Quantity = 1, Price = 150000 }
    };

    foreach (var bookingService in bookingServices)
    {
        if (!db.BookingServices.Any(bs => bs.Id == bookingService.Id || (bs.BookingId == bookingService.BookingId && bs.ServiceId == bookingService.ServiceId)))
        {
            db.BookingServices.Add(bookingService);
        }
    }
    db.SaveChanges();

    var bookingSlots = new[]
    {
        new BookingSlots { BookingId = Guid.Parse("00000000-0000-0000-0000-000000000500"), SlotId = Guid.Parse("00000000-0000-0000-0000-000000000403") },
        new BookingSlots { BookingId = Guid.Parse("00000000-0000-0000-0000-000000000501"), SlotId = Guid.Parse("00000000-0000-0000-0000-000000000404") }
    };

    foreach (var bookingSlot in bookingSlots)
    {
        if (!db.BookingSlots.Any(bs => bs.BookingId == bookingSlot.BookingId && bs.SlotId == bookingSlot.SlotId))
        {
            db.BookingSlots.Add(bookingSlot);
        }
    }
    db.SaveChanges();

    var reviews = new[]
    {
        new Reviews { Id = Guid.Parse("00000000-0000-0000-0000-000000000700"), UserId = Guid.Parse("00000000-0000-0000-0000-000000000011"), SportCenterId = Guid.Parse("00000000-0000-0000-0000-000000000100"), BookingId = Guid.Parse("00000000-0000-0000-0000-000000000500"), Rating = 5, Comment = "Sân rất đẹp và dễ đặt lịch.", CreatedAt = DateTime.Parse("2026-08-06T00:00:00") }
    };

    foreach (var review in reviews)
    {
        if (!db.Reviews.Any(r => r.Id == review.Id || (r.UserId == review.UserId && r.SportCenterId == review.SportCenterId && r.BookingId == review.BookingId)))
        {
            db.Reviews.Add(review);
        }
    }
    db.SaveChanges();

    var images = new[]
    {
        new SportCenterImages { Id = Guid.Parse("00000000-0000-0000-0000-000000000800"), SportCenterId = Guid.Parse("00000000-0000-0000-0000-000000000100"), Url = "http://10.0.2.2:5286/images/champions-arena-1.jpg?v=2" },
        new SportCenterImages { Id = Guid.Parse("00000000-0000-0000-0000-000000000801"), SportCenterId = Guid.Parse("00000000-0000-0000-0000-000000000101"), Url = "http://10.0.2.2:5286/images/elite-sports-hub-1.jpg?v=2" },
        new SportCenterImages { Id = Guid.Parse("00000000-0000-0000-0000-000000000802"), SportCenterId = Guid.Parse("00000000-0000-0000-0000-000000000102"), Url = "http://10.0.2.2:5286/images/stadium-3.jpg?v=2" },
        new SportCenterImages { Id = Guid.Parse("00000000-0000-0000-0000-000000000803"), SportCenterId = Guid.Parse("00000000-0000-0000-0000-000000000103"), Url = "http://10.0.2.2:5286/images/stadium-4.jpg?v=2" },
        new SportCenterImages { Id = Guid.Parse("00000000-0000-0000-0000-000000000804"), SportCenterId = Guid.Parse("00000000-0000-0000-0000-000000000104"), Url = "http://10.0.2.2:5286/images/stadium-5.jpg?v=2" },
        new SportCenterImages { Id = Guid.Parse("00000000-0000-0000-0000-000000000805"), SportCenterId = Guid.Parse("00000000-0000-0000-0000-000000000105"), Url = "http://10.0.2.2:5286/images/stadium-6.jpg?v=2" },
        new SportCenterImages { Id = Guid.Parse("00000000-0000-0000-0000-000000000806"), SportCenterId = Guid.Parse("00000000-0000-0000-0000-000000000106"), Url = "http://10.0.2.2:5286/images/stadium-7.jpg?v=2" },
        new SportCenterImages { Id = Guid.Parse("00000000-0000-0000-0000-000000000807"), SportCenterId = Guid.Parse("00000000-0000-0000-0000-000000000107"), Url = "http://10.0.2.2:5286/images/stadium-8.jpg?v=2" },
        new SportCenterImages { Id = Guid.Parse("00000000-0000-0000-0000-000000000808"), SportCenterId = Guid.Parse("00000000-0000-0000-0000-000000000108"), Url = "http://10.0.2.2:5286/images/stadium-9.jpg?v=2" },
        new SportCenterImages { Id = Guid.Parse("00000000-0000-0000-0000-000000000809"), SportCenterId = Guid.Parse("00000000-0000-0000-0000-000000000109"), Url = "http://10.0.2.2:5286/images/stadium-10.jpg?v=2" }
    };

    foreach (var image in images)
    {
        var existing = db.SportCenterImages.FirstOrDefault(i => i.Id == image.Id);
        if (existing == null)
        {
            db.SportCenterImages.Add(image);
        }
        else
        {
            existing.Url = image.Url;
        }
    }
    db.SaveChanges();
}
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseStaticFiles();
app.UseMiddleware<SportHub.Middleware.ExceptionMiddleware>();
app.UseCors("AllowAll");
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapHub<NotificationHub>("/hubs/notifications");
app.Run();