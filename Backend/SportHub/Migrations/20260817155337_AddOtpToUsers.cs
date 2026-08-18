using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace SportHub.Migrations
{
    /// <inheritdoc />
    public partial class AddOtpToUsers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Fields_SportCentersId",
                table: "Fields");

            migrationBuilder.DropIndex(
                name: "IX_BookingSlots_BookingsId",
                table: "BookingSlots");

            migrationBuilder.DropIndex(
                name: "IX_Bookings_FieldId_BookingDate_SlotId",
                table: "Bookings");

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000010"));

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000011"));

            migrationBuilder.DropColumn(
                name: "SportCentersId",
                table: "Fields");

            migrationBuilder.DropColumn(
                name: "BookingsId",
                table: "BookingSlots");

            migrationBuilder.DropColumn(
                name: "SlotId",
                table: "Bookings");

            migrationBuilder.AddColumn<string>(
                name: "Otp",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "OtpExpiry",
                table: "Users",
                type: "datetime2",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_BookingSlots_BookingId_SlotId",
                table: "BookingSlots",
                columns: new[] { "BookingId", "SlotId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_FieldId",
                table: "Bookings",
                column: "FieldId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_BookingSlots_BookingId_SlotId",
                table: "BookingSlots");

            migrationBuilder.DropIndex(
                name: "IX_Bookings_FieldId",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "Otp",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "OtpExpiry",
                table: "Users");

            migrationBuilder.AddColumn<Guid>(
                name: "SportCentersId",
                table: "Fields",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "BookingsId",
                table: "BookingSlots",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "SlotId",
                table: "Bookings",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "AvatarUrl", "CreatedAt", "Email", "Name", "PasswordHash", "PhoneNumber", "Status" },
                values: new object[,]
                {
                    { new Guid("00000000-0000-0000-0000-000000000010"), "", new DateTime(2026, 8, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), "admin@sporthub.com", "Admin", "$2a$11$Xtr6DdthQBq1WtwTDQ3Lr.4gzArv34A4/sp7bK8jVjgwa3wsq84Yy", "0123456789", "Active" },
                    { new Guid("00000000-0000-0000-0000-000000000011"), "", new DateTime(2026, 8, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), "user@sporthub.com", "User", "$2a$11$KrDcAJ6qFoxkp/ansLcO6.7FjMMO55b.yR1AopsCJIB8zq2zvZL7y", "0987654321", "Active" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Fields_SportCentersId",
                table: "Fields",
                column: "SportCentersId");

            migrationBuilder.CreateIndex(
                name: "IX_BookingSlots_BookingsId",
                table: "BookingSlots",
                column: "BookingsId");

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_FieldId_BookingDate_SlotId",
                table: "Bookings",
                columns: new[] { "FieldId", "BookingDate", "SlotId" },
                unique: true);
        }
    }
}
