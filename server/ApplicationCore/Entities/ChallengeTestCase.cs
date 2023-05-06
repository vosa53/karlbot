namespace ApplicationCore.Entities
{
    /// <summary>
    /// Challenge test case.
    /// </summary>
    public class ChallengeTestCase
    {
        /// <summary>
        /// ID.
        /// </summary>
        public Guid Id { get; set; }

        /// <summary>
        /// Id of the challenge.
        /// </summary>
        public Guid ChallengeId { get; set; }

        /// <summary>
        /// Challenge.
        /// </summary>
        public Challenge? Challenge { get; set; }

        /// <summary>
        /// Sorting order.
        /// </summary>
        public int Order { get; set; }

        /// <summary>
        /// Input town.
        /// </summary>
        public string InputTown { get; set; }

        /// <summary>
        /// Expected output town for <see cref="InputTown"/>.
        /// </summary>
        public string OutputTown { get; set; }

        /// <summary>
        /// Whether Karel position in actual and expected output town has to match.
        /// </summary>
        public bool CheckKarelPosition { get; set; }

        /// <summary>
        /// Whether Karel direction in actual and expected output town has to match.
        /// </summary>
        public bool CheckKarelDirection { get; set; }

        /// <summary>
        /// Whether sign counts in actual and expected output town has to match.
        /// </summary>
        public bool CheckSigns { get; set; }

        /// <summary>
        /// Whether it is publicly visible (e.g. as an example test case).
        /// </summary>
        public bool IsPublic { get; set; }

        /// <param name="inputTown">Input town.</param>
        /// <param name="outputTown">Expected output town for the given input town.</param>
        /// <param name="checkKarelPosition">Whether Karel position in actual and expected output town has to match.</param>
        /// <param name="checkKarelDirection">Whether Karel direction in actual and expected output town has to match.</param>
        /// <param name="checkSigns">Whether sign counts in actual and expected output town has to match.</param>
        /// <param name="isPublic">Whether it is publicly visible (e.g. as an example test case).</param>
        public ChallengeTestCase(string inputTown, string outputTown, bool checkKarelPosition, bool checkKarelDirection, bool checkSigns, bool isPublic)
        {
            InputTown = inputTown;
            OutputTown = outputTown;
            CheckKarelPosition = checkKarelPosition;
            CheckKarelDirection = checkKarelDirection;
            CheckSigns = checkSigns;
            IsPublic = isPublic;
        }
    }
}
