using ApplicationCore.Entities;

namespace KarlBot.DataModels.Projects
{
    public class ProjectDataModel
    {
        public int Id { get; set; }
        public string AuthorId { get; set; }
        public bool IsPublic { get; set; }
        public DateTime Created { get; set; }
        public DateTime Modified { get; set; }
        public string ProjectFile { get; set; }
    }
}
