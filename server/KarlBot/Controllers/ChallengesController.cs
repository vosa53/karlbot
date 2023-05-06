using ApplicationCore.Entities;
using ApplicationCore.Repositories;
using KarlBot.Authorization;
using KarlBot.DataModels.Challenges;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace KarlBot.Controllers
{
    /// <summary>
    /// REST API controller with endpoints related to challenges.
    /// </summary>
    [Route("Api/[controller]")]
    [ApiController]
    public class ChallengesController : ControllerBase
    {
        private readonly IChallengeRepository _challengeRepository;

        /// <summary>
        /// Initializes a new controller instance.
        /// </summary>
        public ChallengesController(IChallengeRepository challengeRepository)
        {
            _challengeRepository = challengeRepository;
        }

        /// <summary>
        /// Returns all challenges.
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ChallengeDataModel>>> GetAsync()
        {
            var challenges = await _challengeRepository.GetWithSubmissionsInfoAsync(User.GetId());

            return challenges.Select(c => ToDataModel(c)).ToList();
        }

        /// <summary>
        /// Returns a challenge by its ID.
        /// </summary>
        /// <param name="id">Challenge ID.</param>
        /// <response code="404">Challenge with the given ID does not exist.</response>
        [HttpGet("{id}")]
        public async Task<ActionResult<ChallengeDataModel>> GetByIdAsync(Guid id)
        {
            var challenge = await _challengeRepository.GetByIdWithSubmissionsInfoAsync(id, User.GetId());
            if (challenge == null)
                return NotFound();

            return ToDataModel(challenge);
        }

        /// <summary>
        /// Creates a new challenge.
        /// </summary>
        /// <param name="dataModel">Challenge data.</param>
        [Authorize(Roles = RoleNames.Admin)]
        [HttpPost]
        public async Task<ActionResult> AddAsync(ChallengeDataModel dataModel)
        {
            if (dataModel.TestCases == null)
                return BadRequest();

            var challengeTestCases = dataModel.TestCases?.Select(tc => ToTestCase(tc)).ToList();
            var challenge = new Challenge(dataModel.Name, dataModel.Description, dataModel.Difficulty, challengeTestCases);
            await _challengeRepository.AddAsync(challenge);

            var challengeWithSubmissionsInfo = new ChallengeWithSubmissionsInfo
            {
                Challenge = challenge,
                OwnSubmissionCount = 0,
                OwnSuccessfulSubmissionCount = 0,
                UsersSubmittedCount = 0,
                UsersSuccessfullySubmittedCount = 0
            };
            return CreatedAtAction(nameof(GetByIdAsync), new { id = challenge.Id }, ToDataModel(challengeWithSubmissionsInfo));
        }

        /// <summary>
        /// Updates a challenge by its ID.
        /// </summary>
        /// <param name="id">Challenge ID.</param>
        /// <param name="dataModel">New challenge data.</param>
        [Authorize(Roles = RoleNames.Admin)]
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateAsync(Guid id, ChallengeDataModel dataModel)
        {
            if (id != dataModel.Id)
                return BadRequest();
            if (dataModel.TestCases == null)
                return BadRequest();

            var challenge = await _challengeRepository.GetByIdAsync(id);
            if (challenge == null)
                return NotFound();

            challenge.Name = dataModel.Name;
            challenge.Description = dataModel.Description;
            challenge.Difficulty = dataModel.Difficulty;
            challenge.TestCases = dataModel.TestCases?.Select(tc => ToTestCase(tc)).ToList();

            await _challengeRepository.UpdateAsync(challenge);

            return NoContent();
        }

        /// <summary>
        /// Deletes a challenge by its ID.
        /// </summary>
        /// <param name="id">Challenge ID.</param>
        /// <response code="404">Challenge with the given ID does not exist.</response>
        [Authorize(Roles = RoleNames.Admin)]
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(Guid id)
        {
            var challenge = await _challengeRepository.GetByIdAsync(id);
            if (challenge == null)
                return NotFound();

            await _challengeRepository.RemoveAsync(challenge);

            return NoContent();
        }

        private ChallengeDataModel ToDataModel(ChallengeWithSubmissionsInfo challengeWthSubmissionsInfo)
        {
            var isAdmin = User.IsInRole(RoleNames.Admin);

            return new ChallengeDataModel
            {
                Id = challengeWthSubmissionsInfo.Challenge.Id,
                Name = challengeWthSubmissionsInfo.Challenge.Name,
                Description = challengeWthSubmissionsInfo.Challenge.Description,
                Difficulty = challengeWthSubmissionsInfo.Challenge.Difficulty,
                SubmissionsInfo = new ChallengeSubmissionsInfoDataModel
                {
                    OwnSubmissionCount = challengeWthSubmissionsInfo.OwnSubmissionCount,
                    OwnSuccessfulSubmissionCount = challengeWthSubmissionsInfo.OwnSuccessfulSubmissionCount,
                    UsersSubmittedCount = challengeWthSubmissionsInfo.UsersSubmittedCount,
                    UsersSuccessfullySubmittedCount = challengeWthSubmissionsInfo.UsersSuccessfullySubmittedCount
                },
                TestCases = challengeWthSubmissionsInfo.Challenge.TestCases
                    ?.Where(tc => tc.IsPublic || isAdmin)
                    ?.Select(tc => ToDataModel(tc))
                    ?.ToList()
            };
        }

        private ChallengeTestCaseDataModel ToDataModel(ChallengeTestCase testCase)
        {
            return new ChallengeTestCaseDataModel
            {
                InputTown = testCase.InputTown,
                OutputTown = testCase.OutputTown,
                CheckKarelPosition = testCase.CheckKarelPosition,
                CheckKarelDirection = testCase.CheckKarelDirection,
                CheckSigns = testCase.CheckSigns,
                IsPublic = testCase.IsPublic
            };
        }

        private ChallengeTestCase ToTestCase(ChallengeTestCaseDataModel dataModel)
        {
            return new ChallengeTestCase(
                dataModel.InputTown,
                dataModel.OutputTown,
                dataModel.CheckKarelPosition,
                dataModel.CheckKarelDirection,
                dataModel.CheckSigns,
                dataModel.IsPublic
            );
        }
    }
}
