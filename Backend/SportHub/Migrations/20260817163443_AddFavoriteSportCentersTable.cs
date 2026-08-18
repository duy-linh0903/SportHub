using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SportHub.Migrations
{
    /// <inheritdoc />
    public partial class AddFavoriteSportCentersTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "FavoriteSportCenters",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SportCenterId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FavoriteSportCenters", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FavoriteSportCenters_SportCenters_SportCenterId",
                        column: x => x.SportCenterId,
                        principalTable: "SportCenters",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_FavoriteSportCenters_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_FavoriteSportCenters_SportCenterId",
                table: "FavoriteSportCenters",
                column: "SportCenterId");

            migrationBuilder.CreateIndex(
                name: "IX_FavoriteSportCenters_UserId",
                table: "FavoriteSportCenters",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FavoriteSportCenters");
        }
    }
}
