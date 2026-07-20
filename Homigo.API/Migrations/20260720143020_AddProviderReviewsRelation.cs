using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Homigo.API.Migrations
{
    /// <inheritdoc />
    public partial class AddProviderReviewsRelation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AverageRating",
                table: "ProviderProfiles");

            migrationBuilder.AddColumn<int>(
                name: "ProviderProfileId",
                table: "Reviews",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_ProviderProfileId",
                table: "Reviews",
                column: "ProviderProfileId");

            migrationBuilder.AddForeignKey(
                name: "FK_Reviews_ProviderProfiles_ProviderProfileId",
                table: "Reviews",
                column: "ProviderProfileId",
                principalTable: "ProviderProfiles",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reviews_ProviderProfiles_ProviderProfileId",
                table: "Reviews");

            migrationBuilder.DropIndex(
                name: "IX_Reviews_ProviderProfileId",
                table: "Reviews");

            migrationBuilder.DropColumn(
                name: "ProviderProfileId",
                table: "Reviews");

            migrationBuilder.AddColumn<double>(
                name: "AverageRating",
                table: "ProviderProfiles",
                type: "float",
                nullable: false,
                defaultValue: 0.0);
        }
    }
}
