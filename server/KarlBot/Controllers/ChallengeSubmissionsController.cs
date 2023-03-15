using ApplicationCore.Entities;
using ApplicationCore.Repositories;
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

        public ChallengeSubmissionsController(IChallengeRepository challengeRepository, IChallengeSubmissionRepository challengeSubmissionRepository, IUserRepository userRepository)
        {
            _challengeRepository = challengeRepository;
            _challengeSubmissionRepository = challengeSubmissionRepository;
            _userRepository = userRepository;
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

            return ToDataModel(submission);
        }

        [HttpPost]
        public async Task<ActionResult> AddAsync(int challengeId, [FromBody] ChallengeSubmissionDataModel dataModel)
        {
            var challenge = await _challengeRepository.GetByIdAsync(challengeId);
            if (challenge == null)
                return NotFound();

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var submission = new ChallengeSubmission(challengeId, userId, dataModel.ProjectFile);

            var evaluator = new ChallengeEvaluator();
            var evaluationResult = await evaluator.EvaluateAsync(submission.ProjectFile, challenge.EvaluationCode);

            submission.EvaluationState = evaluationResult.type switch
            {
                ChallengeEvaluationResultType.Success => ChallengeSubmissionEvaluationState.Success,
                ChallengeEvaluationResultType.Failure => ChallengeSubmissionEvaluationState.Failure,
                ChallengeEvaluationResultType.SystemError => ChallengeSubmissionEvaluationState.SystemError
            };
            submission.EvaluationMessage = evaluationResult.message;

            await _challengeSubmissionRepository.AddAsync(submission);

            return CreatedAtAction(nameof(GetByIdAsync), new { id = submission.Id }, ToDataModel(submission));
        }

        private ChallengeSubmissionDataModel ToDataModel(ChallengeSubmission submission)
        {
            var isAdmin = User.IsInRole("Admin");

            return new ChallengeSubmissionDataModel
            {
                Id = submission.Id,
                UserId = submission.UserId,
                ProjectFile = submission.ProjectFile,
                EvaluationState = submission.EvaluationState,
                EvaluationMessage = isAdmin || submission.EvaluationState != ChallengeSubmissionEvaluationState.SystemError ? submission.EvaluationMessage : ""
            };
        }
    }
}
