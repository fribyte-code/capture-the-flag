using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace friByte.capturetheflag.service.Migrations.Ctf
{
    /// <inheritdoc />
    public partial class TaskPointsDescriptionSolvedTaskTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "CtfTasks",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "Points",
                table: "CtfTasks",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "SolvedTasks",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TeamId = table.Column<string>(type: "text", nullable: false),
                    TaskId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SolvedTasks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SolvedTasks_CtfTasks_TaskId",
                        column: x => x.TaskId,
                        principalTable: "CtfTasks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SolvedTasks_TaskId",
                table: "SolvedTasks",
                column: "TaskId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SolvedTasks");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "CtfTasks");

            migrationBuilder.DropColumn(
                name: "Points",
                table: "CtfTasks");
        }
    }
}
