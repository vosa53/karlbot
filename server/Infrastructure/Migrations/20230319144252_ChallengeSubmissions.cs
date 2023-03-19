using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class ChallengeSubmissions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EvaluationMessage",
                table: "ChallengeSubmissions");

            migrationBuilder.DropColumn(
                name: "EvaluationState",
                table: "ChallengeSubmissions");

            migrationBuilder.DropColumn(
                name: "EvaluationCode",
                table: "Challenges");

            migrationBuilder.AddColumn<string>(
                name: "EvaluationResult_Message",
                table: "ChallengeSubmissions",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "EvaluationResult_SuccessRate",
                table: "ChallengeSubmissions",
                type: "float",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "ChallengeTestCases",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ChallengeId = table.Column<int>(type: "int", nullable: false),
                    Order = table.Column<int>(type: "int", nullable: false),
                    InputTown = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    OutputTown = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CheckKarelPosition = table.Column<bool>(type: "bit", nullable: false),
                    CheckKarelDirection = table.Column<bool>(type: "bit", nullable: false),
                    CheckSigns = table.Column<bool>(type: "bit", nullable: false),
                    IsPublic = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChallengeTestCases", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ChallengeTestCases_Challenges_ChallengeId",
                        column: x => x.ChallengeId,
                        principalTable: "Challenges",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ChallengeTestCases_ChallengeId",
                table: "ChallengeTestCases",
                column: "ChallengeId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ChallengeTestCases");

            migrationBuilder.DropColumn(
                name: "EvaluationResult_Message",
                table: "ChallengeSubmissions");

            migrationBuilder.DropColumn(
                name: "EvaluationResult_SuccessRate",
                table: "ChallengeSubmissions");

            migrationBuilder.AddColumn<string>(
                name: "EvaluationMessage",
                table: "ChallengeSubmissions",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "EvaluationState",
                table: "ChallengeSubmissions",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "EvaluationCode",
                table: "Challenges",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
