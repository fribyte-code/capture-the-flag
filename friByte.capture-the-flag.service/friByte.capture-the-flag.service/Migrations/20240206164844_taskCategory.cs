using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace friByte.capturetheflag.service.Migrations.Ctf
{
    /// <inheritdoc />
    public partial class taskCategory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Category",
                table: "CtfTasks",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "ReleaseDateTime",
                table: "CtfTasks",
                type: "timestamp with time zone",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Category",
                table: "CtfTasks");

            migrationBuilder.DropColumn(
                name: "ReleaseDateTime",
                table: "CtfTasks");
        }
    }
}
