using ApplicationCore.Entities;
using ApplicationCore.Repositories;
using Google.Apis.Util;
using KarlBot.Authorization;
using KarlBot.DataModels.Challenges;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace KarlBot.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ChallengesController : ControllerBase
    {
        private readonly IChallengeRepository _challengeRepository;

        public ChallengesController(IChallengeRepository challengeRepository)
        {
            _challengeRepository = challengeRepository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ChallengeDataModel>>> GetAsync()
        {
            var challenges = await _challengeRepository.GetWithSubmissionsInfoAsync(User.GetId());

            return challenges.Select(c => ToDataModel(c)).ToList();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ChallengeDataModel>> GetByIdAsync(int id)
        {
            var challenge = await _challengeRepository.GetByIdWithSubmissionsInfoAsync(id, User.GetId());
            if (challenge == null)
                return NotFound();

            return ToDataModel(challenge);
        }

        [Authorize(Roles = "Admin")]
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

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateAsync(int id, ChallengeDataModel dataModel)
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

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var challenge = await _challengeRepository.GetByIdAsync(id);
            if (challenge == null)
                return NotFound();

            await _challengeRepository.RemoveAsync(challenge);

            return NoContent();
        }

        private ChallengeDataModel ToDataModel(ChallengeWithSubmissionsInfo challengeWthSubmissionsInfo)
        {
            var isAdmin = User.IsInRole("Admin");

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
