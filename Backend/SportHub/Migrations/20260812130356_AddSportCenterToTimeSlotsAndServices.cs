using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SportHub.Migrations
{
    /// <inheritdoc />
    public partial class AddSportCenterToTimeSlotsAndServices : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "SportCenterId",
                table: "TimeSlots",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "SportCenterId",
                table: "ServiceItem",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "ServiceItem",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000300"),
                column: "SportCenterId",
                value: null);

            migrationBuilder.UpdateData(
                table: "ServiceItem",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000301"),
                column: "SportCenterId",
                value: null);

            migrationBuilder.UpdateData(
                table: "ServiceItem",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000302"),
                column: "SportCenterId",
                value: null);

            migrationBuilder.UpdateData(
                table: "ServiceItem",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000303"),
                column: "SportCenterId",
                value: null);

            migrationBuilder.UpdateData(
                table: "TimeSlots",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000400"),
                column: "SportCenterId",
                value: null);

            migrationBuilder.UpdateData(
                table: "TimeSlots",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000401"),
                column: "SportCenterId",
                value: null);

            migrationBuilder.UpdateData(
                table: "TimeSlots",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000402"),
                column: "SportCenterId",
                value: null);

            migrationBuilder.UpdateData(
                table: "TimeSlots",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000403"),
                column: "SportCenterId",
                value: null);

            migrationBuilder.UpdateData(
                table: "TimeSlots",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000404"),
                column: "SportCenterId",
                value: null);

            migrationBuilder.UpdateData(
                table: "TimeSlots",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000405"),
                column: "SportCenterId",
                value: null);

            migrationBuilder.UpdateData(
                table: "TimeSlots",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000406"),
                column: "SportCenterId",
                value: null);

            migrationBuilder.UpdateData(
                table: "TimeSlots",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000407"),
                column: "SportCenterId",
                value: null);

            migrationBuilder.UpdateData(
                table: "TimeSlots",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000408"),
                column: "SportCenterId",
                value: null);

            migrationBuilder.UpdateData(
                table: "TimeSlots",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000409"),
                column: "SportCenterId",
                value: null);

            migrationBuilder.UpdateData(
                table: "TimeSlots",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-00000000040a"),
                column: "SportCenterId",
                value: null);

            migrationBuilder.UpdateData(
                table: "TimeSlots",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-00000000040b"),
                column: "SportCenterId",
                value: null);

            migrationBuilder.UpdateData(
                table: "TimeSlots",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-00000000040c"),
                column: "SportCenterId",
                value: null);

            migrationBuilder.UpdateData(
                table: "TimeSlots",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-00000000040d"),
                column: "SportCenterId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000010"),
                column: "PasswordHash",
                value: "$2a$11$Xtr6DdthQBq1WtwTDQ3Lr.4gzArv34A4/sp7bK8jVjgwa3wsq84Yy");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000011"),
                column: "PasswordHash",
                value: "$2a$11$KrDcAJ6qFoxkp/ansLcO6.7FjMMO55b.yR1AopsCJIB8zq2zvZL7y");

            migrationBuilder.CreateIndex(
                name: "IX_TimeSlots_SportCenterId",
                table: "TimeSlots",
                column: "SportCenterId");

            migrationBuilder.CreateIndex(
                name: "IX_ServiceItem_SportCenterId",
                table: "ServiceItem",
                column: "SportCenterId");

            migrationBuilder.AddForeignKey(
                name: "FK_ServiceItem_SportCenters_SportCenterId",
                table: "ServiceItem",
                column: "SportCenterId",
                principalTable: "SportCenters",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_TimeSlots_SportCenters_SportCenterId",
                table: "TimeSlots",
                column: "SportCenterId",
                principalTable: "SportCenters",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ServiceItem_SportCenters_SportCenterId",
                table: "ServiceItem");

            migrationBuilder.DropForeignKey(
                name: "FK_TimeSlots_SportCenters_SportCenterId",
                table: "TimeSlots");

            migrationBuilder.DropIndex(
                name: "IX_TimeSlots_SportCenterId",
                table: "TimeSlots");

            migrationBuilder.DropIndex(
                name: "IX_ServiceItem_SportCenterId",
                table: "ServiceItem");

            migrationBuilder.DropColumn(
                name: "SportCenterId",
                table: "TimeSlots");

            migrationBuilder.DropColumn(
                name: "SportCenterId",
                table: "ServiceItem");

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
        }
    }
}
