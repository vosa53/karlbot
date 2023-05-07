namespace ApplicationCore.Entities
{
    /// <summary>
    /// Project.
    /// </summary>
    public class Project
    {
        /// <summary>
        /// ID.
        /// </summary>
        public Guid Id { get; set; }

        /// <summary>
        /// ID of the author.
        /// </summary>
        public Guid AuthorId { get; set; }

        /// <summary>
        /// Author.
        /// </summary>
        public User? Author { get; set; }

        /// <summary>
        /// Wheter it is publicly accessible or only for its author.
        /// </summary>
        public bool IsPublic { get; set; }

        /// <summary>
        /// Date and time when the project was created.
        /// </summary>
        public DateTime Created { get; set; }

        /// <summary>
        /// Date and time of the last project modification.
        /// </summary>
        public DateTime Modified { get; set; }

        /// <summary>
        /// Project file.
        /// </summary>
        public string ProjectFile { get; set; }

        /// <param name="authorId">Id of the author.</param>
        /// <param name="created">Date and time when the project was created.</param>
        /// <param name="projectFile">Project file.</param>
        public Project(Guid authorId, DateTime created, string projectFile)
        {
            AuthorId = authorId;
            Created = created;
            Modified = created;
            ProjectFile = projectFile;
        }
    }
}
