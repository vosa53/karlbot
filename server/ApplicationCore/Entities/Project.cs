using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApplicationCore.Entities
{
    public class Project
    {
        public int Id { get; set; }
        public string AuthorId { get; set; }
        public User? Author { get; set; }
        public bool IsPublic { get; set; }
        public DateTime Created { get; set; }
        public DateTime Modified { get; set; }
        public string ProjectFile { get; set; }

        public Project(string authorId, DateTime created, string projectFile)
        {
            AuthorId = authorId;
            Created = created;
            Modified = created;
            ProjectFile = projectFile;
        }
    }
}
