using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QuickMarkWeb.Server.Migrations
{
    /// <inheritdoc />
    public partial class ExamHasQuestionnaire : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Questionnaires_Exams_ExamId",
                table: "Questionnaires");

            migrationBuilder.DropIndex(
                name: "IX_Questionnaires_ExamId",
                table: "Questionnaires");

            migrationBuilder.AddColumn<int>(
                name: "QuestionnaireId",
                table: "Exams",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Exams_QuestionnaireId",
                table: "Exams",
                column: "QuestionnaireId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Exams_Questionnaires_QuestionnaireId",
                table: "Exams",
                column: "QuestionnaireId",
                principalTable: "Questionnaires",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Exams_Questionnaires_QuestionnaireId",
                table: "Exams");

            migrationBuilder.DropIndex(
                name: "IX_Exams_QuestionnaireId",
                table: "Exams");

            migrationBuilder.DropColumn(
                name: "QuestionnaireId",
                table: "Exams");

            migrationBuilder.CreateIndex(
                name: "IX_Questionnaires_ExamId",
                table: "Questionnaires",
                column: "ExamId");

            migrationBuilder.AddForeignKey(
                name: "FK_Questionnaires_Exams_ExamId",
                table: "Questionnaires",
                column: "ExamId",
                principalTable: "Exams",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
