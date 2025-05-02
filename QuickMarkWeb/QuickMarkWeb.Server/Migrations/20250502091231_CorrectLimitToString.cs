using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QuickMarkWeb.Server.Migrations
{
    /// <inheritdoc />
    public partial class CorrectLimitToString : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "CorrectLimit",
                table: "Exams",
                type: "text",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "CorrectLimit",
                table: "Exams",
                type: "integer",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");
        }
    }
}
