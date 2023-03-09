using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApplicationCore.Entities
{
    public class Challenge
    {
        public int Id { get; init; }

        public string Name { get; init; }

        public string Description { get; init; }

        public string EvaluationCode { get; set; }
    }
}
