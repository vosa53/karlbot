using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApplicationCore.Entities
{
    public class Challenge
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public IList<ChallengeTestCase>? TestCases { get; set; }

        public Challenge(string name, string description, IList<ChallengeTestCase>? testCases)
        {
            Name = name;
            Description = description;
            TestCases = testCases;
        }

        public Challenge()
        {
        }
    }
}
