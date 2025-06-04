using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QuickMarkWeb.Server.Migrations
{
    /// <inheritdoc />
    public partial class InitialSetupComplete : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "full_name",
                table: "user",
                type: "character varying(255)",
                maxLength: 255,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "username",
                table: "user",
                type: "varchar(6)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "user_username",
                table: "exam_result",
                type: "varchar(6)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "user_username",
                table: "exam",
                type: "varchar(6)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "full_name",
                table: "user",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(255)",
                oldMaxLength: 255);

            migrationBuilder.AlterColumn<string>(
                name: "username",
                table: "user",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(6)");

            migrationBuilder.AlterColumn<string>(
                name: "user_username",
                table: "exam_result",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(6)");

            migrationBuilder.AlterColumn<string>(
                name: "user_username",
                table: "exam",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(6)");
        }
    }
}
