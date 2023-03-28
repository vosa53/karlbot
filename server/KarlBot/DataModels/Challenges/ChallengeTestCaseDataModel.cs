using System.ComponentModel.DataAnnotations;

namespace KarlBot.DataModels.Challenges
{
    public class ChallengeTestCaseDataModel
    {
        [StringLength(10_000)]
        public required string InputTown { get; init; }

        [StringLength(10_000)]
        public required string OutputTown { get; init; }
        public required bool CheckKarelPosition { get; init; }
        public required bool CheckKarelDirection { get; init; }
        public required bool CheckSigns { get; init; }
        public required bool IsPublic { get; init; }
    }
}
