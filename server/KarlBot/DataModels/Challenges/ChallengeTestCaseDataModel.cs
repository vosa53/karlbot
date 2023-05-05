using System.ComponentModel.DataAnnotations;

namespace KarlBot.DataModels.Challenges
{
    /// <summary>
    /// Challenge test case.
    /// </summary>
    public class ChallengeTestCaseDataModel
    {
        /// <summary>
        /// Input town.
        /// </summary>
        [Required]
        [StringLength(10_000)]
        public required string InputTown { get; init; }

        /// <summary>
        /// Expected output town for the input town.
        /// </summary>
        [Required]
        [StringLength(10_000)]
        public required string OutputTown { get; init; }

        /// <summary>
        /// Whether Karel position in actual and expected output town has to match.
        /// </summary>
        public required bool CheckKarelPosition { get; init; }

        /// <summary>
        /// Whether Karel direction in actual and expected output town has to match.
        /// </summary>
        public required bool CheckKarelDirection { get; init; }

        /// <summary>
        /// Whether sign counts in actual and expected output town has to match.
        /// </summary>
        public required bool CheckSigns { get; init; }

        /// <summary>
        /// Whether it is publicly visible (e.g. as an example test case).
        /// </summary>
        public required bool IsPublic { get; init; }
    }
}
