using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QuickMarkWeb.Server.Migrations
{
    /// <inheritdoc />
    public partial class QuestionnaireToManyExams : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Exams_Courses_CourseId",
                table: "Exams");

            migrationBuilder.DropIndex(
                name: "IX_Exams_QuestionnaireId",
                table: "Exams");

            migrationBuilder.RenameColumn(
                name: "CourseId",
                table: "Exams",
                newName: "CourseCode");

            migrationBuilder.RenameIndex(
                name: "IX_Exams_CourseId",
                table: "Exams",
                newName: "IX_Exams_CourseCode");

            migrationBuilder.CreateIndex(
                name: "IX_Questionnaires_CourseCode",
                table: "Questionnaires",
                column: "CourseCode");

            migrationBuilder.CreateIndex(
                name: "IX_Exams_QuestionnaireId",
                table: "Exams",
                column: "QuestionnaireId");

            migrationBuilder.AddForeignKey(
                name: "FK_Exams_Courses_CourseCode",
                table: "Exams",
                column: "CourseCode",
                principalTable: "Courses",
                principalColumn: "Code",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Questionnaires_Courses_CourseCode",
                table: "Questionnaires",
                column: "CourseCode",
                principalTable: "Courses",
                principalColumn: "Code",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Exams_Courses_CourseCode",
                table: "Exams");

            migrationBuilder.DropForeignKey(
                name: "FK_Questionnaires_Courses_CourseCode",
                table: "Questionnaires");

            migrationBuilder.DropIndex(
                name: "IX_Questionnaires_CourseCode",
                table: "Questionnaires");

            migrationBuilder.DropIndex(
                name: "IX_Exams_QuestionnaireId",
                table: "Exams");

            migrationBuilder.RenameColumn(
                name: "CourseCode",
                table: "Exams",
                newName: "CourseId");

            migrationBuilder.RenameIndex(
                name: "IX_Exams_CourseCode",
                table: "Exams",
                newName: "IX_Exams_CourseId");

            migrationBuilder.CreateIndex(
                name: "IX_Exams_QuestionnaireId",
                table: "Exams",
                column: "QuestionnaireId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Exams_Courses_CourseId",
                table: "Exams",
                column: "CourseId",
                principalTable: "Courses",
                principalColumn: "Code",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
