using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SportHub.Migrations
{
    /// <inheritdoc />
    public partial class AddOwnerIdToSportCenters : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "OwnerId",
                table: "SportCenters",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "SportCenters",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000100"),
                column: "OwnerId",
                value: null);

            migrationBuilder.UpdateData(
                table: "SportCenters",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000101"),
                column: "OwnerId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000010"),
                column: "PasswordHash",
                value: "$2a$11$6E5LYuCJ9IFLor3Zs64Isu88teFwqgQX2xZZFqxj8nwpBfXpDXRy2");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000011"),
                column: "PasswordHash",
                value: "$2a$11$a9H6UVXfGxo0cITeJwryCOH5v7kVjNJ0RjUlyrDgJQAApY8HJmR86");

            migrationBuilder.CreateIndex(
                name: "IX_SportCenters_OwnerId",
                table: "SportCenters",
                column: "OwnerId");

            migrationBuilder.AddForeignKey(
                name: "FK_SportCenters_Users_OwnerId",
                table: "SportCenters",
                column: "OwnerId",
                principalTable: "Users",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SportCenters_Users_OwnerId",
                table: "SportCenters");

            migrationBuilder.DropIndex(
                name: "IX_SportCenters_OwnerId",
                table: "SportCenters");

            migrationBuilder.DropColumn(
                name: "OwnerId",
                table: "SportCenters");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000010"),
                column: "PasswordHash",
                value: "$2a$11$uz06z8VxEPvhfyqmmc4AWOlEOuop6plfNQmwFh6ywMXQ7pQ4gCkby");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000011"),
                column: "PasswordHash",
                value: "$2a$11$Vr/QawYUa.Mc9Yy87sdSI.yeRpjOEoWDkRDvOK84OKCgPjZNjqtvm");
        }
    }
}
