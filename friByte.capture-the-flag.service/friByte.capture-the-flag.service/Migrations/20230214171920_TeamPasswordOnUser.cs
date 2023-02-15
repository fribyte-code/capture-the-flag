using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace friByte.capturetheflag.service.Migrations.Identity
{
    /// <inheritdoc />
    public partial class TeamPasswordOnUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "TeamPassword",
                table: "AspNetUsers",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TeamPassword",
                table: "AspNetUsers");
        }
    }
}
