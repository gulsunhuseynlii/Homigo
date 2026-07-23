using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Homigo.API.Migrations
{
    /// <inheritdoc />
    public partial class UpdateProviderProfile : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CategoryId",
                table: "ProviderProfiles",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "CertificateUrl",
                table: "ProviderProfiles",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CvUrl",
                table: "ProviderProfiles",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "IdentityCardUrl",
                table: "ProviderProfiles",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PhoneNumber",
                table: "ProviderProfiles",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_ProviderProfiles_CategoryId",
                table: "ProviderProfiles",
                column: "CategoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_ProviderProfiles_Categories_CategoryId",
                table: "ProviderProfiles",
                column: "CategoryId",
                principalTable: "Categories",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProviderProfiles_Categories_CategoryId",
                table: "ProviderProfiles");

            migrationBuilder.DropIndex(
                name: "IX_ProviderProfiles_CategoryId",
                table: "ProviderProfiles");

            migrationBuilder.DropColumn(
                name: "CategoryId",
                table: "ProviderProfiles");

            migrationBuilder.DropColumn(
                name: "CertificateUrl",
                table: "ProviderProfiles");

            migrationBuilder.DropColumn(
                name: "CvUrl",
                table: "ProviderProfiles");

            migrationBuilder.DropColumn(
                name: "IdentityCardUrl",
                table: "ProviderProfiles");

            migrationBuilder.DropColumn(
                name: "PhoneNumber",
                table: "ProviderProfiles");
        }
    }
}
