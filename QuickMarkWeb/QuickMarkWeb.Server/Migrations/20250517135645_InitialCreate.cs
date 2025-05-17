using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace QuickMarkWeb.Server.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "course",
                columns: table => new
                {
                    code = table.Column<string>(type: "text", nullable: false),
                    name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("p_k_course", x => x.code);
                });

            migrationBuilder.CreateTable(
                name: "user",
                columns: table => new
                {
                    username = table.Column<string>(type: "text", nullable: false),
                    full_name = table.Column<string>(type: "text", nullable: false),
                    password = table.Column<string>(type: "text", nullable: false),
                    salt = table.Column<byte[]>(type: "bytea", nullable: false),
                    is_admin = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("p_k_user", x => x.username);
                });

            migrationBuilder.CreateTable(
                name: "questionnaire",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    gift_file = table.Column<string>(type: "text", nullable: false),
                    answers = table.Column<string>(type: "text", nullable: false),
                    course_code = table.Column<string>(type: "text", nullable: false),
                    exam_id = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("p_k_questionnaire", x => x.id);
                    table.ForeignKey(
                        name: "fk_questionnaire_course",
                        column: x => x.course_code,
                        principalTable: "course",
                        principalColumn: "code",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "exam",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    course_id = table.Column<string>(type: "text", nullable: false),
                    user_username = table.Column<string>(type: "text", nullable: false),
                    held_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    questionnaire_id = table.Column<int>(type: "integer", nullable: false),
                    question_amount = table.Column<int>(type: "integer", nullable: false),
                    correct_limit = table.Column<string>(type: "text", nullable: false),
                    applied_students = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("p_k_exam", x => x.id);
                    table.ForeignKey(
                        name: "fk_exam_course",
                        column: x => x.course_id,
                        principalTable: "course",
                        principalColumn: "code",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_exam_questionnaire",
                        column: x => x.questionnaire_id,
                        principalTable: "questionnaire",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_exam_user",
                        column: x => x.user_username,
                        principalTable: "user",
                        principalColumn: "username",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "exam_result",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    exam_id = table.Column<int>(type: "integer", nullable: false),
                    examinee_neptun_code = table.Column<string>(type: "text", nullable: false),
                    user_username = table.Column<string>(type: "text", nullable: false),
                    correct_answers = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("p_k_exam_result", x => x.id);
                    table.ForeignKey(
                        name: "fk_exam_result_exam",
                        column: x => x.exam_id,
                        principalTable: "exam",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_exam_result_user",
                        column: x => x.user_username,
                        principalTable: "user",
                        principalColumn: "username",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "i_x_exam_course_id",
                table: "exam",
                column: "course_id");

            migrationBuilder.CreateIndex(
                name: "i_x_exam_questionnaire_id",
                table: "exam",
                column: "questionnaire_id");

            migrationBuilder.CreateIndex(
                name: "i_x_exam_user_username",
                table: "exam",
                column: "user_username");

            migrationBuilder.CreateIndex(
                name: "i_x_exam_result_exam_id",
                table: "exam_result",
                column: "exam_id");

            migrationBuilder.CreateIndex(
                name: "i_x_exam_result_user_username",
                table: "exam_result",
                column: "user_username");

            migrationBuilder.CreateIndex(
                name: "i_x_questionnaire_course_code",
                table: "questionnaire",
                column: "course_code");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "exam_result");

            migrationBuilder.DropTable(
                name: "exam");

            migrationBuilder.DropTable(
                name: "questionnaire");

            migrationBuilder.DropTable(
                name: "user");

            migrationBuilder.DropTable(
                name: "course");
        }
    }
}
