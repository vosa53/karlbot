using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RenamedChallengeEvaluationProperties : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "SuccessRate",
                table: "ChallengeSubmissions",
                newName: "EvaluationSuccessRate");

            migrationBuilder.RenameColumn(
                name: "Message",
                table: "ChallengeSubmissions",
                newName: "EvaluationMessage");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "EvaluationSuccessRate",
                table: "ChallengeSubmissions",
                newName: "SuccessRate");

            migrationBuilder.RenameColumn(
                name: "EvaluationMessage",
                table: "ChallengeSubmissions",
                newName: "Message");
        }
    }
}
