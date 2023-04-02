using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RemoveEvaluationResult : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "EvaluationResult_SuccessRate",
                table: "ChallengeSubmissions",
                newName: "SuccessRate");

            migrationBuilder.RenameColumn(
                name: "EvaluationResult_Message",
                table: "ChallengeSubmissions",
                newName: "Message");

            migrationBuilder.AlterColumn<double>(
                name: "SuccessRate",
                table: "ChallengeSubmissions",
                type: "float",
                nullable: false,
                defaultValue: 0.0,
                oldClrType: typeof(double),
                oldType: "float",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Message",
                table: "ChallengeSubmissions",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "SuccessRate",
                table: "ChallengeSubmissions",
                newName: "EvaluationResult_SuccessRate");

            migrationBuilder.RenameColumn(
                name: "Message",
                table: "ChallengeSubmissions",
                newName: "EvaluationResult_Message");

            migrationBuilder.AlterColumn<double>(
                name: "EvaluationResult_SuccessRate",
                table: "ChallengeSubmissions",
                type: "float",
                nullable: true,
                oldClrType: typeof(double),
                oldType: "float");

            migrationBuilder.AlterColumn<string>(
                name: "EvaluationResult_Message",
                table: "ChallengeSubmissions",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");
        }
    }
}
