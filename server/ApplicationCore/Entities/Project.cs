using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApplicationCore.Entities
{
    public class Project
    {
        public int Id { get; init; }
        public bool IsPublic { get; init; }
        public string ProjectFile { get; init; }
    }
}
