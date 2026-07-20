using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Homigo.API.Migrations
{
    /// <inheritdoc />
    public partial class AddProviderServiceRelation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ProviderProfileService",
                columns: table => new
                {
                    ProvidersId = table.Column<int>(type: "int", nullable: false),
                    ServicesId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProviderProfileService", x => new { x.ProvidersId, x.ServicesId });
                    table.ForeignKey(
                        name: "FK_ProviderProfileService_ProviderProfiles_ProvidersId",
                        column: x => x.ProvidersId,
                        principalTable: "ProviderProfiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProviderProfileService_Services_ServicesId",
                        column: x => x.ServicesId,
                        principalTable: "Services",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ProviderProfileService_ServicesId",
                table: "ProviderProfileService",
                column: "ServicesId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProviderProfileService");
        }
    }
}
