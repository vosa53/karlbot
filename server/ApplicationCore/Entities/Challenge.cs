﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApplicationCore.Entities
{
    /// <summary>
    /// Challenge.
    /// </summary>
    public class Challenge
    {
        public int Id { get; set; }

        /// <summary>
        /// Name.
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// Description.
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// Test cases.
        /// </summary>
        public IList<ChallengeTestCase>? TestCases { get; set; }

        /// <param name="name">Name.</param>
        /// <param name="description">Description.</param>
        /// <param name="testCases">Test cases.</param>
        public Challenge(string name, string description, IList<ChallengeTestCase>? testCases)
        {
            Name = name;
            Description = description;
            TestCases = testCases;
        }

        private Challenge()
        {
        }
    }
}
