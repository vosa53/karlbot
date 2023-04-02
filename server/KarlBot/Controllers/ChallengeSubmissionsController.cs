using ApplicationCore.Entities;
using ApplicationCore.Repositories;
using ApplicationCore.Services;
using Infrastructure;
using KarlBot.Authorization;
using KarlBot.DataModels.Challenges;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace KarlBot.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ChallengeSubmissionsController : ControllerBase
    {
        private readonly IChallengeRepository _challengeRepository;
        private readonly IChallengeSubmissionRepository _challengeSubmissionRepository;
        private readonly IUserRepository _userRepository;
        private readonly IChallengeEvaluationService _challengeEvaluationService;

        public ChallengeSubmissionsController(IChallengeRepository challengeRepository, IChallengeSubmissionRepository challengeSubmissionRepository, 
            IUserRepository userRepository, IChallengeEvaluationService challengeEvaluationService)
        {
            _challengeRepository = challengeRepository;
            _challengeSubmissionRepository = challengeSubmissionRepository;
            _userRepository = userRepository;
            _challengeEvaluationService = challengeEvaluationService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ChallengeSubmissionDataModel>>> GetAsync(int challengeId, string? userId)
        {
            var existsChallenge = await _challengeRepository.ExistsByIdAsync(challengeId);
            if (!existsChallenge)
                return NotFound();

            if (!User.IsInRole("Admin") && userId != User.GetId())
                return Forbid();

            if (userId != null)
            {
                var existsUser = await _userRepository.ExistsByIdAsync(userId);
                if (!existsUser)
                    return NotFound();
            }

            var submissions = await _challengeSubmissionRepository.GetAsync(challengeId, userId);

            return submissions.Select(c => ToDataModel(c)).ToList();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ChallengeSubmissionDataModel>> GetByIdAsync(int id)
        {
            var submission = await _challengeSubmissionRepository.GetByIdAsync(id);
            if (submission == null)
                return NotFound();

            if (submission.UserId != User.GetId() && !User.IsInRole("Admin"))
                return Forbid();

            return ToDataModel(submission);
        }

        [HttpPost]
        public async Task<ActionResult> AddAsync(int challengeId, [FromBody] ChallengeSubmissionDataModel dataModel)
        {
            var challenge = await _challengeRepository.GetByIdAsync(challengeId);
            if (challenge == null)
                return NotFound();

            var evaluationResult = await _challengeEvaluationService.EvaluateAsync(dataModel.ProjectFile, challenge.TestCases!);

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var submission = new ChallengeSubmission(challengeId, userId, DateTime.UtcNow, dataModel.ProjectFile,
                evaluationResult.SuccessRate, evaluationResult.Message);

            await _challengeSubmissionRepository.AddAsync(submission);

            return CreatedAtAction(nameof(GetByIdAsync), new { id = submission.Id }, ToDataModel(submission));
        }

        private ChallengeSubmissionDataModel ToDataModel(ChallengeSubmission submission)
        {
            return new ChallengeSubmissionDataModel
            {
                Id = submission.Id,
                UserId = submission.UserId,
                Created = submission.Created,
                ProjectFile = submission.ProjectFile,
                EvaluationResult = new ChallengeSubmissionEvaluationResultDataModel
                {
                    SuccessRate = submission.EvaluationSuccessRate,
                    Message = submission.EvaluationMessage
                }
            };
        }
    }
}
