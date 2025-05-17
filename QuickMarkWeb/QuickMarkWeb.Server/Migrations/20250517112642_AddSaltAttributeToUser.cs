using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QuickMarkWeb.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddSaltAttributeToUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ExamResults_Exams_ExamId",
                table: "ExamResults");

            migrationBuilder.DropForeignKey(
                name: "FK_ExamResults_Users_UserUsername",
                table: "ExamResults");

            migrationBuilder.DropForeignKey(
                name: "FK_Exams_Courses_CourseCode",
                table: "Exams");

            migrationBuilder.DropForeignKey(
                name: "FK_Exams_Questionnaires_QuestionnaireId",
                table: "Exams");

            migrationBuilder.DropForeignKey(
                name: "FK_Exams_Users_UserUsername",
                table: "Exams");

            migrationBuilder.DropForeignKey(
                name: "FK_Questionnaires_Courses_CourseCode",
                table: "Questionnaires");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Users",
                table: "Users");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Questionnaires",
                table: "Questionnaires");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Exams",
                table: "Exams");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ExamResults",
                table: "ExamResults");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Courses",
                table: "Courses");

            migrationBuilder.RenameTable(
                name: "Users",
                newName: "user");

            migrationBuilder.RenameTable(
                name: "Questionnaires",
                newName: "questionnaire");

            migrationBuilder.RenameTable(
                name: "Exams",
                newName: "exam");

            migrationBuilder.RenameTable(
                name: "ExamResults",
                newName: "exam_result");

            migrationBuilder.RenameTable(
                name: "Courses",
                newName: "course");

            migrationBuilder.RenameColumn(
                name: "Salt",
                table: "user",
                newName: "salt");

            migrationBuilder.RenameColumn(
                name: "Password",
                table: "user",
                newName: "password");

            migrationBuilder.RenameColumn(
                name: "Username",
                table: "user",
                newName: "username");

            migrationBuilder.RenameColumn(
                name: "IsAdmin",
                table: "user",
                newName: "is_admin");

            migrationBuilder.RenameColumn(
                name: "FullName",
                table: "user",
                newName: "full_name");

            migrationBuilder.RenameIndex(
                name: "IX_Questionnaires_CourseCode",
                table: "questionnaire",
                newName: "IX_questionnaire_CourseCode");

            migrationBuilder.RenameIndex(
                name: "IX_Exams_UserUsername",
                table: "exam",
                newName: "IX_exam_UserUsername");

            migrationBuilder.RenameIndex(
                name: "IX_Exams_QuestionnaireId",
                table: "exam",
                newName: "IX_exam_QuestionnaireId");

            migrationBuilder.RenameIndex(
                name: "IX_Exams_CourseCode",
                table: "exam",
                newName: "IX_exam_CourseCode");

            migrationBuilder.RenameIndex(
                name: "IX_ExamResults_UserUsername",
                table: "exam_result",
                newName: "IX_exam_result_UserUsername");

            migrationBuilder.RenameIndex(
                name: "IX_ExamResults_ExamId",
                table: "exam_result",
                newName: "IX_exam_result_ExamId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_user",
                table: "user",
                column: "username");

            migrationBuilder.AddPrimaryKey(
                name: "PK_questionnaire",
                table: "questionnaire",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_exam",
                table: "exam",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_exam_result",
                table: "exam_result",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_course",
                table: "course",
                column: "Code");

            migrationBuilder.AddForeignKey(
                name: "fk_exam_course",
                table: "exam",
                column: "CourseCode",
                principalTable: "course",
                principalColumn: "Code",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "fk_exam_questionnaire",
                table: "exam",
                column: "QuestionnaireId",
                principalTable: "questionnaire",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "fk_exam_user",
                table: "exam",
                column: "UserUsername",
                principalTable: "user",
                principalColumn: "username",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "fk_exam_result_exam",
                table: "exam_result",
                column: "ExamId",
                principalTable: "exam",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "fk_exam_result_user",
                table: "exam_result",
                column: "UserUsername",
                principalTable: "user",
                principalColumn: "username",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "fk_questionnaire_course",
                table: "questionnaire",
                column: "CourseCode",
                principalTable: "course",
                principalColumn: "Code",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_exam_course",
                table: "exam");

            migrationBuilder.DropForeignKey(
                name: "fk_exam_questionnaire",
                table: "exam");

            migrationBuilder.DropForeignKey(
                name: "fk_exam_user",
                table: "exam");

            migrationBuilder.DropForeignKey(
                name: "fk_exam_result_exam",
                table: "exam_result");

            migrationBuilder.DropForeignKey(
                name: "fk_exam_result_user",
                table: "exam_result");

            migrationBuilder.DropForeignKey(
                name: "fk_questionnaire_course",
                table: "questionnaire");

            migrationBuilder.DropPrimaryKey(
                name: "PK_user",
                table: "user");

            migrationBuilder.DropPrimaryKey(
                name: "PK_questionnaire",
                table: "questionnaire");

            migrationBuilder.DropPrimaryKey(
                name: "PK_exam_result",
                table: "exam_result");

            migrationBuilder.DropPrimaryKey(
                name: "PK_exam",
                table: "exam");

            migrationBuilder.DropPrimaryKey(
                name: "PK_course",
                table: "course");

            migrationBuilder.RenameTable(
                name: "user",
                newName: "Users");

            migrationBuilder.RenameTable(
                name: "questionnaire",
                newName: "Questionnaires");

            migrationBuilder.RenameTable(
                name: "exam_result",
                newName: "ExamResults");

            migrationBuilder.RenameTable(
                name: "exam",
                newName: "Exams");

            migrationBuilder.RenameTable(
                name: "course",
                newName: "Courses");

            migrationBuilder.RenameColumn(
                name: "salt",
                table: "Users",
                newName: "Salt");

            migrationBuilder.RenameColumn(
                name: "password",
                table: "Users",
                newName: "Password");

            migrationBuilder.RenameColumn(
                name: "username",
                table: "Users",
                newName: "Username");

            migrationBuilder.RenameColumn(
                name: "is_admin",
                table: "Users",
                newName: "IsAdmin");

            migrationBuilder.RenameColumn(
                name: "full_name",
                table: "Users",
                newName: "FullName");

            migrationBuilder.RenameIndex(
                name: "IX_questionnaire_CourseCode",
                table: "Questionnaires",
                newName: "IX_Questionnaires_CourseCode");

            migrationBuilder.RenameIndex(
                name: "IX_exam_result_UserUsername",
                table: "ExamResults",
                newName: "IX_ExamResults_UserUsername");

            migrationBuilder.RenameIndex(
                name: "IX_exam_result_ExamId",
                table: "ExamResults",
                newName: "IX_ExamResults_ExamId");

            migrationBuilder.RenameIndex(
                name: "IX_exam_UserUsername",
                table: "Exams",
                newName: "IX_Exams_UserUsername");

            migrationBuilder.RenameIndex(
                name: "IX_exam_QuestionnaireId",
                table: "Exams",
                newName: "IX_Exams_QuestionnaireId");

            migrationBuilder.RenameIndex(
                name: "IX_exam_CourseCode",
                table: "Exams",
                newName: "IX_Exams_CourseCode");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Users",
                table: "Users",
                column: "Username");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Questionnaires",
                table: "Questionnaires",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ExamResults",
                table: "ExamResults",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Exams",
                table: "Exams",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Courses",
                table: "Courses",
                column: "Code");

            migrationBuilder.AddForeignKey(
                name: "FK_ExamResults_Exams_ExamId",
                table: "ExamResults",
                column: "ExamId",
                principalTable: "Exams",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ExamResults_Users_UserUsername",
                table: "ExamResults",
                column: "UserUsername",
                principalTable: "Users",
                principalColumn: "Username",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Exams_Courses_CourseCode",
                table: "Exams",
                column: "CourseCode",
                principalTable: "Courses",
                principalColumn: "Code",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Exams_Questionnaires_QuestionnaireId",
                table: "Exams",
                column: "QuestionnaireId",
                principalTable: "Questionnaires",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Exams_Users_UserUsername",
                table: "Exams",
                column: "UserUsername",
                principalTable: "Users",
                principalColumn: "Username",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Questionnaires_Courses_CourseCode",
                table: "Questionnaires",
                column: "CourseCode",
                principalTable: "Courses",
                principalColumn: "Code",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
