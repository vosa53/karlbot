using ApplicationCore.Entities;
using ApplicationCore.Repositories;
using KarlBot.Authorization;
using KarlBot.DataModels.Projects;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace KarlBot.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ProjectsController : ControllerBase
    {
        private readonly IProjectRepository _projectRepository;

        public ProjectsController(IProjectRepository projectRepository)
        {
            _projectRepository = projectRepository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProjectDataModel>>> GetAsync(string? authorId)
        {
            if (!User.IsInRole("Admin") && authorId != User.GetId())
                return Forbid();

            var projects = await _projectRepository.GetAsync(authorId);

            return projects.Select(p => ToDataModel(p)).ToList();
        }

        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<ActionResult<ProjectDataModel>> GetByIdAsync(int id)
        {
            var project = await _projectRepository.GetByIdAsync(id);
            if (project == null)
                return NotFound();

            if (!project.IsPublic && (User == null || project.AuthorId != User.GetId() && !User.IsInRole("Admin")))
                return Forbid();

            return ToDataModel(project);
        }

        [HttpPost]
        public async Task<ActionResult> AddAsync(ProjectDataModel dataModel)
        {
            var project = new Project(dataModel.AuthorId, DateTime.UtcNow, dataModel.ProjectFile);
            await _projectRepository.AddAsync(project);

            return CreatedAtAction(nameof(GetByIdAsync), new { id = project.Id }, ToDataModel(project));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateAsync(int id, ProjectDataModel dataModel)
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

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
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
