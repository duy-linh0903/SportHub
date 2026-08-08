using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace SportHub.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Roles",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    RoleName = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Roles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ServiceItem",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Price = table.Column<double>(type: "float", nullable: false),
                    Type = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ServiceItem", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SportCenters",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Address = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SportCenters", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TimeSlots",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    StartTime = table.Column<TimeOnly>(type: "time", nullable: false),
                    EndTime = table.Column<TimeOnly>(type: "time", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TimeSlots", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    PhoneNumber = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AvatarUrl = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Fields",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SportCenterId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Type = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    PricePerSlot = table.Column<double>(type: "float", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Fields", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Fields_SportCenters_SportCenterId",
                        column: x => x.SportCenterId,
                        principalTable: "SportCenters",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SportCenterImages",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SportCenterId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Url = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SportCenterImages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SportCenterImages_SportCenters_SportCenterId",
                        column: x => x.SportCenterId,
                        principalTable: "SportCenters",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserRoles",
                columns: table => new
                {
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    RoleId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserRoles", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_UserRoles_Roles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "Roles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserRoles_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Bookings",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FieldId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    BookingDate = table.Column<DateOnly>(type: "date", nullable: false),
                    TotalPrice = table.Column<double>(type: "float", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CheckInCode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Bookings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Bookings_Fields_FieldId",
                        column: x => x.FieldId,
                        principalTable: "Fields",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Bookings_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "BookingServices",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    BookingId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ServiceId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    Price = table.Column<double>(type: "float", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BookingServices", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BookingServices_Bookings_BookingId",
                        column: x => x.BookingId,
                        principalTable: "Bookings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BookingServices_ServiceItem_ServiceId",
                        column: x => x.ServiceId,
                        principalTable: "ServiceItem",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "BookingSlots",
                columns: table => new
                {
                    BookingId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SlotId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BookingSlots", x => new { x.BookingId, x.SlotId });
                    table.ForeignKey(
                        name: "FK_BookingSlots_Bookings_BookingId",
                        column: x => x.BookingId,
                        principalTable: "Bookings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BookingSlots_TimeSlots_SlotId",
                        column: x => x.SlotId,
                        principalTable: "TimeSlots",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Reviews",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SportCenterId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    BookingId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Rating = table.Column<int>(type: "int", nullable: false),
                    Comment = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Reviews", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Reviews_Bookings_BookingId",
                        column: x => x.BookingId,
                        principalTable: "Bookings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Reviews_SportCenters_SportCenterId",
                        column: x => x.SportCenterId,
                        principalTable: "SportCenters",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Reviews_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.InsertData(
                table: "Roles",
                columns: new[] { "Id", "RoleName" },
                values: new object[,]
                {
                    { new Guid("00000000-0000-0000-0000-000000000001"), "User" },
                    { new Guid("00000000-0000-0000-0000-000000000002"), "Admin" }
                });

            migrationBuilder.InsertData(
                table: "ServiceItem",
                columns: new[] { "Id", "Description", "Name", "Price", "Status", "Type" },
                values: new object[,]
                {
                    { new Guid("00000000-0000-0000-0000-000000000300"), "Dịch vụ thuê bóng", "Đá bóng", 50000.0, "Active", "Equipment" },
                    { new Guid("00000000-0000-0000-0000-000000000301"), "Dịch vụ thuê vợt và shuttlecock", "Cầu lông", 30000.0, "Active", "Equipment" },
                    { new Guid("00000000-0000-0000-0000-000000000302"), "Buổi tư vấn kỹ thuật", "Tư vấn huấn luyện", 150000.0, "Active", "Coach" },
                    { new Guid("00000000-0000-0000-0000-000000000303"), "Sử dụng phòng thay đồ", "Phòng thay đồ", 20000.0, "Active", "Facility" }
                });

            migrationBuilder.InsertData(
                table: "SportCenters",
                columns: new[] { "Id", "Address", "CreatedAt", "Description", "Name", "Status" },
                values: new object[,]
                {
                    { new Guid("00000000-0000-0000-0000-000000000100"), "123 Nguyễn Huệ, Quận 1", new DateTime(2026, 8, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), "Sân thể thao hiện đại, phù hợp cho bóng đá và cầu lông.", "Champions Arena", "Active" },
                    { new Guid("00000000-0000-0000-0000-000000000101"), "456 Lê Văn Sỹ, Quận 3", new DateTime(2026, 8, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), "Trung tâm thể thao đa năng với nhiều loại sân.", "Elite Sports Hub", "Active" }
                });

            migrationBuilder.InsertData(
                table: "TimeSlots",
                columns: new[] { "Id", "EndTime", "StartTime" },
                values: new object[,]
                {
                    { new Guid("00000000-0000-0000-0000-000000000400"), new TimeOnly(8, 0, 0), new TimeOnly(7, 0, 0) },
                    { new Guid("00000000-0000-0000-0000-000000000401"), new TimeOnly(9, 0, 0), new TimeOnly(8, 0, 0) },
                    { new Guid("00000000-0000-0000-0000-000000000402"), new TimeOnly(10, 0, 0), new TimeOnly(9, 0, 0) },
                    { new Guid("00000000-0000-0000-0000-000000000403"), new TimeOnly(11, 0, 0), new TimeOnly(10, 0, 0) },
                    { new Guid("00000000-0000-0000-0000-000000000404"), new TimeOnly(12, 0, 0), new TimeOnly(11, 0, 0) },
                    { new Guid("00000000-0000-0000-0000-000000000405"), new TimeOnly(13, 0, 0), new TimeOnly(12, 0, 0) },
                    { new Guid("00000000-0000-0000-0000-000000000406"), new TimeOnly(14, 0, 0), new TimeOnly(13, 0, 0) },
                    { new Guid("00000000-0000-0000-0000-000000000407"), new TimeOnly(15, 0, 0), new TimeOnly(14, 0, 0) },
                    { new Guid("00000000-0000-0000-0000-000000000408"), new TimeOnly(16, 0, 0), new TimeOnly(15, 0, 0) },
                    { new Guid("00000000-0000-0000-0000-000000000409"), new TimeOnly(17, 0, 0), new TimeOnly(16, 0, 0) },
                    { new Guid("00000000-0000-0000-0000-00000000040a"), new TimeOnly(18, 0, 0), new TimeOnly(17, 0, 0) },
                    { new Guid("00000000-0000-0000-0000-00000000040b"), new TimeOnly(19, 0, 0), new TimeOnly(18, 0, 0) },
                    { new Guid("00000000-0000-0000-0000-00000000040c"), new TimeOnly(20, 0, 0), new TimeOnly(19, 0, 0) },
                    { new Guid("00000000-0000-0000-0000-00000000040d"), new TimeOnly(21, 0, 0), new TimeOnly(20, 0, 0) }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "AvatarUrl", "CreatedAt", "Email", "Name", "PasswordHash", "PhoneNumber", "Status" },
                values: new object[,]
                {
                    { new Guid("00000000-0000-0000-0000-000000000010"), "", new DateTime(2026, 8, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), "admin@sporthub.com", "Admin", "$2a$11$uz06z8VxEPvhfyqmmc4AWOlEOuop6plfNQmwFh6ywMXQ7pQ4gCkby", "0123456789", "Active" },
                    { new Guid("00000000-0000-0000-0000-000000000011"), "", new DateTime(2026, 8, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), "user@sporthub.com", "User", "$2a$11$Vr/QawYUa.Mc9Yy87sdSI.yeRpjOEoWDkRDvOK84OKCgPjZNjqtvm", "0987654321", "Active" }
                });

            migrationBuilder.InsertData(
                table: "Fields",
                columns: new[] { "Id", "CreatedAt", "Name", "PricePerSlot", "SportCenterId", "Status", "Type" },
                values: new object[,]
                {
                    { new Guid("00000000-0000-0000-0000-000000000200"), new DateTime(2026, 8, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), "Sân 1", 120000.0, new Guid("00000000-0000-0000-0000-000000000100"), "Active", "Badminton" },
                    { new Guid("00000000-0000-0000-0000-000000000201"), new DateTime(2026, 8, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), "Sân 2", 250000.0, new Guid("00000000-0000-0000-0000-000000000100"), "Active", "Football" },
                    { new Guid("00000000-0000-0000-0000-000000000202"), new DateTime(2026, 8, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), "Sân 3", 180000.0, new Guid("00000000-0000-0000-0000-000000000101"), "Active", "Tennis" }
                });

            migrationBuilder.InsertData(
                table: "SportCenterImages",
                columns: new[] { "Id", "SportCenterId", "Url" },
                values: new object[,]
                {
                    { new Guid("00000000-0000-0000-0000-000000000800"), new Guid("00000000-0000-0000-0000-000000000100"), "https://example.com/images/champions-arena-1.jpg" },
                    { new Guid("00000000-0000-0000-0000-000000000801"), new Guid("00000000-0000-0000-0000-000000000101"), "https://example.com/images/elite-sports-hub-1.jpg" }
                });

            migrationBuilder.InsertData(
                table: "UserRoles",
                columns: new[] { "RoleId", "UserId" },
                values: new object[,]
                {
                    { new Guid("00000000-0000-0000-0000-000000000002"), new Guid("00000000-0000-0000-0000-000000000010") },
                    { new Guid("00000000-0000-0000-0000-000000000001"), new Guid("00000000-0000-0000-0000-000000000011") }
                });

            migrationBuilder.InsertData(
                table: "Bookings",
                columns: new[] { "Id", "BookingDate", "CheckInCode", "CreatedAt", "FieldId", "Status", "TotalPrice", "UserId" },
                values: new object[,]
                {
                    { new Guid("00000000-0000-0000-0000-000000000500"), new DateOnly(2026, 8, 10), "CHK001", new DateTime(2026, 8, 5, 10, 0, 0, 0, DateTimeKind.Unspecified), new Guid("00000000-0000-0000-0000-000000000200"), "Confirmed", 240000.0, new Guid("00000000-0000-0000-0000-000000000011") },
                    { new Guid("00000000-0000-0000-0000-000000000501"), new DateOnly(2026, 8, 11), "CHK002", new DateTime(2026, 8, 5, 11, 30, 0, 0, DateTimeKind.Unspecified), new Guid("00000000-0000-0000-0000-000000000201"), "Pending", 500000.0, new Guid("00000000-0000-0000-0000-000000000011") }
                });

            migrationBuilder.InsertData(
                table: "BookingServices",
                columns: new[] { "Id", "BookingId", "Price", "Quantity", "ServiceId" },
                values: new object[,]
                {
                    { new Guid("00000000-0000-0000-0000-000000000600"), new Guid("00000000-0000-0000-0000-000000000500"), 100000.0, 2, new Guid("00000000-0000-0000-0000-000000000300") },
                    { new Guid("00000000-0000-0000-0000-000000000601"), new Guid("00000000-0000-0000-0000-000000000500"), 30000.0, 1, new Guid("00000000-0000-0000-0000-000000000301") },
                    { new Guid("00000000-0000-0000-0000-000000000602"), new Guid("00000000-0000-0000-0000-000000000501"), 150000.0, 1, new Guid("00000000-0000-0000-0000-000000000302") }
                });

            migrationBuilder.InsertData(
                table: "BookingSlots",
                columns: new[] { "BookingId", "SlotId" },
                values: new object[,]
                {
                    { new Guid("00000000-0000-0000-0000-000000000500"), new Guid("00000000-0000-0000-0000-000000000403") },
                    { new Guid("00000000-0000-0000-0000-000000000501"), new Guid("00000000-0000-0000-0000-000000000404") }
                });

            migrationBuilder.InsertData(
                table: "Reviews",
                columns: new[] { "Id", "BookingId", "Comment", "CreatedAt", "Rating", "SportCenterId", "UserId" },
                values: new object[] { new Guid("00000000-0000-0000-0000-000000000700"), new Guid("00000000-0000-0000-0000-000000000500"), "Sân rất đẹp và dễ đặt lịch.", new DateTime(2026, 8, 6, 0, 0, 0, 0, DateTimeKind.Unspecified), 5, new Guid("00000000-0000-0000-0000-000000000100"), new Guid("00000000-0000-0000-0000-000000000011") });

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_FieldId",
                table: "Bookings",
                column: "FieldId");

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_UserId",
                table: "Bookings",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_BookingServices_BookingId",
                table: "BookingServices",
                column: "BookingId");

            migrationBuilder.CreateIndex(
                name: "IX_BookingServices_ServiceId",
                table: "BookingServices",
                column: "ServiceId");

            migrationBuilder.CreateIndex(
                name: "IX_BookingSlots_SlotId",
                table: "BookingSlots",
                column: "SlotId");

            migrationBuilder.CreateIndex(
                name: "IX_Fields_SportCenterId",
                table: "Fields",
                column: "SportCenterId");

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_BookingId",
                table: "Reviews",
                column: "BookingId");

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_SportCenterId",
                table: "Reviews",
                column: "SportCenterId");

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_UserId",
                table: "Reviews",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_SportCenterImages_SportCenterId",
                table: "SportCenterImages",
                column: "SportCenterId");

            migrationBuilder.CreateIndex(
                name: "IX_UserRoles_RoleId",
                table: "UserRoles",
                column: "RoleId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BookingServices");

            migrationBuilder.DropTable(
                name: "BookingSlots");

            migrationBuilder.DropTable(
                name: "Reviews");

            migrationBuilder.DropTable(
                name: "SportCenterImages");

            migrationBuilder.DropTable(
                name: "UserRoles");

            migrationBuilder.DropTable(
                name: "ServiceItem");

            migrationBuilder.DropTable(
                name: "TimeSlots");

            migrationBuilder.DropTable(
                name: "Bookings");

            migrationBuilder.DropTable(
                name: "Roles");

            migrationBuilder.DropTable(
                name: "Fields");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "SportCenters");
        }
    }
}
