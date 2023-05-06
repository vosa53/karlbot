using ApplicationCore.Entities;
using ApplicationCore.Repositories;
using ApplicationCore.Services;
using KarlBot.Authorization;
using KarlBot.DataModels.Challenges;
using Microsoft.AspNetCore.Mvc;

namespace KarlBot.Controllers
{
    /// <summary>
    /// REST API controller with endpoints related to challenge submissions.
    /// </summary>
    [Route("Api/[controller]")]
    [ApiController]
    public class ChallengeSubmissionsController : ControllerBase
    {
        private readonly IChallengeRepository _challengeRepository;
        private readonly IChallengeSubmissionRepository _challengeSubmissionRepository;
        private readonly IUserRepository _userRepository;
        private readonly IChallengeEvaluationService _challengeEvaluationService;

        /// <summary>
        /// Initializes a new controller instance.
        /// </summary>
        public ChallengeSubmissionsController(IChallengeRepository challengeRepository, IChallengeSubmissionRepository challengeSubmissionRepository, 
            IUserRepository userRepository, IChallengeEvaluationService challengeEvaluationService)
        {
            _challengeRepository = challengeRepository;
            _challengeSubmissionRepository = challengeSubmissionRepository;
            _userRepository = userRepository;
            _challengeEvaluationService = challengeEvaluationService;
        }

        /// <summary>
        /// Returns all submissions of the given challenge.
        /// </summary>
        /// <param name="challengeId">Challenge ID.</param>
        /// <param name="userId">User ID, when only submissions of a specific user are requested.</param>
        /// <response code="404">Challenge or user with the given ID does not exist.</response>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ChallengeSubmissionDataModel>>> GetAsync(Guid challengeId, Guid? userId)
        {
            var existsChallenge = await _challengeRepository.ExistsByIdAsync(challengeId);
            if (!existsChallenge)
                return NotFound();

            if (!User.IsInRole(RoleNames.Admin) && userId != User.GetId())
                return Forbid();

            if (userId.HasValue)
            {
                var existsUser = await _userRepository.ExistsByIdAsync(userId.Value);
                if (!existsUser)
                    return NotFound();
            }

            var submissions = await _challengeSubmissionRepository.GetAsync(challengeId, userId);

            return submissions.Select(c => ToDataModel(c)).ToList();
        }

        /// <summary>
        /// Returns challenge submission by its ID.
        /// </summary>
        /// <param name="id">Challenge submission ID.</param>
        /// <response code="404">Challenge submission with the given ID does not exist.</response>
        [HttpGet("{id}")]
        public async Task<ActionResult<ChallengeSubmissionDataModel>> GetByIdAsync(Guid id)
        {
            var submission = await _challengeSubmissionRepository.GetByIdAsync(id);
            if (submission == null)
                return NotFound();

            if (submission.UserId != User.GetId() && !User.IsInRole(RoleNames.Admin))
                return Forbid();

            return ToDataModel(submission);
        }

        /// <summary>
        /// Creates a new submission for the given challenge.
        /// </summary>
        /// <param name="challengeId">Challenge id.</param>
        /// <param name="dataModel">Submission.</param>
        /// <response code="404">Challenge with the given ID does not exist.</response>
        [HttpPost]
        public async Task<ActionResult> AddAsync(Guid challengeId, [FromBody] ChallengeSubmissionDataModel dataModel)
        {
            var challenge = await _challengeRepository.GetByIdAsync(challengeId);
            if (challenge == null)
                return NotFound();

            var evaluationResult = await _challengeEvaluationService.EvaluateAsync(dataModel.ProjectFile, challenge.TestCases!);

            var submission = new ChallengeSubmission(challengeId, User.GetId(), DateTime.UtcNow, dataModel.ProjectFile,
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
