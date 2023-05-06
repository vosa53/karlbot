import { Injectable } from "@angular/core";
import { ProjectDeserializer, ProjectSerializer } from "karel";
import { ChallengeSubmission } from "../../models/challenge-submission";
import { ChallengeSubmissionEvaluationResult } from "../../models/challenge-submission-evaluation-result";
import { APIService } from "./api-service";

/**
 * Service for managing challenge submissions.
 */
@Injectable({
    providedIn: "root"
})
export class ChallengeSubmissionService {
    private readonly BASE_URL = "/ChallengeSubmissions";

    /**
     * @param apiService Service for server API communication.
     */
    constructor(private readonly apiService: APIService) { }

    /**
     * Returns all submissions of the given challenge.
     * @param challengeId Challenge ID.
     * @param userId User ID, when only submissions of a specific user are requested.
     */
    async get(challengeId: string, userId?: string): Promise<ChallengeSubmission[]> {
        const params: any = { challengeId };
        if (userId !== undefined)
            params.userId = userId;

        const dto = await this.apiService.get<ChallengeSubmissionDTO[]>(this.BASE_URL, { params });
        return dto.map(d => this.fromDTO(d));
    }

    /**
     * Returns challenge submission by its ID.
     * @param id Challenge submission ID.
     */
    async getById(id: string): Promise<ChallengeSubmission> {
        const url = `${this.BASE_URL}/${id}`;
        const dto = await this.apiService.get<ChallengeSubmissionDTO>(url);
        return this.fromDTO(dto);
    }

    /**
     * Creates a new submission for the given challenge.
     * @param challengeId Challenge id.
     * @param challengeSubmission Submission.
     */
    async add(challengeId: string, challengeSubmission: ChallengeSubmission): Promise<ChallengeSubmission> {
        const dto = this.toDTO(challengeSubmission);
        const dtoResult = await this.apiService.post<ChallengeSubmissionDTO>(this.BASE_URL, dto, {
            params: { challengeId }
        });
        return this.fromDTO(dtoResult);
    }

    private toDTO(challengeSubmission: ChallengeSubmission): ChallengeSubmissionDTO {
        return {
            id: challengeSubmission.id,
            userId: challengeSubmission.userId,
            created: challengeSubmission.created.toISOString(),
            projectFile: ProjectSerializer.serialize(challengeSubmission.project),
            evaluationResult: challengeSubmission.evaluationResult
        };
    }

    private fromDTO(dto: ChallengeSubmissionDTO): ChallengeSubmission {
        return {
            id: dto.id,
            userId: dto.userId,
            created: new Date(dto.created),
            project: ProjectDeserializer.deserialize(dto.projectFile, []),
            evaluationResult: dto.evaluationResult
        };
    }
}

interface ChallengeSubmissionDTO {
    readonly id: string | null;
    readonly userId: string;
    readonly created: string;
    readonly projectFile: string;
    readonly evaluationResult: ChallengeSubmissionEvaluationResult | null;
}
