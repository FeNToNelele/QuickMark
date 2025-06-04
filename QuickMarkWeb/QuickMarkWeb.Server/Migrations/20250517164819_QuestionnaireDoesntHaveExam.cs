using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QuickMarkWeb.Server.Migrations
{
    /// <inheritdoc />
    public partial class QuestionnaireDoesntHaveExam : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "exam_id",
                table: "questionnaire");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "exam_id",
                table: "questionnaire",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }
    }
}
