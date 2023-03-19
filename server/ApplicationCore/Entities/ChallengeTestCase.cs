using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApplicationCore.Entities
{
    public class ChallengeTestCase
    {
        public int Id { get; set; }
        public int ChallengeId { get; set; }
        public Challenge Challenge { get; set; }
        public int Order { get; set; }
        public string InputTown { get; set; }
        public string OutputTown { get; set; }
        public bool CheckKarelPosition { get; set; }
        public bool CheckKarelDirection { get; set; }
        public bool CheckSigns { get; set; }
        public bool IsPublic { get; set; }

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
