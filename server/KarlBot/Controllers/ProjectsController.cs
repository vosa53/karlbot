using ApplicationCore.Entities;
using ApplicationCore.Repositories;
using KarlBot.Authorization;
using KarlBot.DataModels.Projects;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace KarlBot.Controllers
{
    /// <summary>
    /// REST API controller with endpoints related to projects.
    /// </summary>
    [Route("Api/[controller]")]
    [ApiController]
    public class ProjectsController : ControllerBase
    {
        private readonly IProjectRepository _projectRepository;

        /// <summary>
        /// Initializes a new controller instance.
        /// </summary>
        public ProjectsController(IProjectRepository projectRepository)
        {
            _projectRepository = projectRepository;
        }

        /// <summary>
        /// Returns all projects.
        /// </summary>
        /// <param name="authorId">User ID, when only projects of a specific user are requested.</param>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProjectDataModel>>> GetAsync(Guid? authorId)
        {
            if (!User.IsInRole("Admin") && authorId != User.GetId())
                return Forbid();

            var projects = await _projectRepository.GetAsync(authorId);

            return projects.Select(p => ToDataModel(p)).ToList();
        }

        /// <summary>
        /// Returns a project by its ID.
        /// </summary>
        /// <param name="id">Project ID.</param>
        /// <response code="404">Project with the given ID does not exist.</response>
        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<ActionResult<ProjectDataModel>> GetByIdAsync(Guid id)
        {
            var project = await _projectRepository.GetByIdAsync(id);
            if (project == null)
                return NotFound();

            if (!project.IsPublic && project.AuthorId != User.GetIdOrNull() && !User.IsInRole("Admin"))
                return Forbid();

            return ToDataModel(project);
        }

        /// <summary>
        /// Creates a new project.
        /// </summary>
        /// <param name="dataModel">Project data.</param>
        [HttpPost]
        public async Task<ActionResult> AddAsync(ProjectDataModel dataModel)
        {
            var project = new Project(dataModel.AuthorId, DateTime.UtcNow, dataModel.ProjectFile);
            await _projectRepository.AddAsync(project);

            return CreatedAtAction(nameof(GetByIdAsync), new { id = project.Id }, ToDataModel(project));
        }

        /// <summary>
        /// Updates a project by its ID.
        /// </summary>
        /// <param name="id">Project ID.</param>
        /// <param name="dataModel">New project data.</param>
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateAsync(Guid id, ProjectDataModel dataModel)
        {
            if (id != dataModel.Id)
                return BadRequest();

            var project = await _projectRepository.GetByIdAsync(id);
            if (project == null)
                return NotFound();

            if (project.AuthorId != User.GetId() && !User.IsInRole("Admin"))
                return Forbid();

            project.IsPublic = dataModel.IsPublic;
            project.ProjectFile = dataModel.ProjectFile;
            project.Modified = DateTime.UtcNow;

            await _projectRepository.UpdateAsync(project);

            return NoContent();
        }

        /// <summary>
        /// Deletes a project by its ID.
        /// </summary>
        /// <param name="id">Project ID.</param>
        /// <response code="404">Project with the given ID does not exist.</response>
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(Guid id)
        {
            var project = await _projectRepository.GetByIdAsync(id);
            if (project == null)
                return NotFound();

            if (project.AuthorId != User.GetId() && !User.IsInRole("Admin"))
                return Forbid();

            await _projectRepository.RemoveAsync(project);

            return NoContent();
        }

        private ProjectDataModel ToDataModel(Project project)
        {
            return new ProjectDataModel
            {
                Id = project.Id,
                AuthorId = project.AuthorId,
                IsPublic = project.IsPublic,
                Created = project.Created,
                Modified = project.Modified,
                ProjectFile = project.ProjectFile
            };
        }
    }
}
