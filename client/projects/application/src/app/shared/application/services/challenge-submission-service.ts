import { Inject, Injectable } from '@angular/core';
import { ProjectDeserializer, ProjectSerializer } from 'projects/karel/src/public-api';
import { API_BASE_URL } from '../api-base-url';
import { ChallengeSubmission } from '../models/challenge-submission';
import { ChallengeSubmissionEvaluationResult } from '../models/challenge-submission-evaluation-result';
import { ApiService } from './api-service';

@Injectable({
    providedIn: 'root'
})
export class ChallengeSubmissionService {
    private readonly projectsBaseUrl: string;

    constructor(private readonly apiService: ApiService, @Inject(API_BASE_URL) apiBaseUrl: string) {
        this.projectsBaseUrl = `${apiBaseUrl}/challengeSubmissions`;
    }

    async get(challengeId: number, userId?: string): Promise<ChallengeSubmission[]> {
        const params: any = { challengeId };
        if (userId !== undefined)
            params.userId = userId;

        const dto = await this.apiService.get<ChallengeSubmissionDTO[]>(this.projectsBaseUrl, { params });
        return dto.map(d => this.fromDTO(d));
    }

    async getById(id: number): Promise<ChallengeSubmission> {
        const url = `${this.projectsBaseUrl}/${id}`;
        const dto = await this.apiService.get<ChallengeSubmissionDTO>(url);
        return this.fromDTO(dto);
    }

    async add(challengeId: number, challengeSubmission: ChallengeSubmission): Promise<ChallengeSubmission> {
        const dto = this.toDTO(challengeSubmission);
        const dtoResult = await this.apiService.post<ChallengeSubmissionDTO>(this.projectsBaseUrl, dto, {
            params: { challengeId }
        });
        return this.fromDTO(dtoResult);
    }

    private toDTO(challengeSubmission: ChallengeSubmission): ChallengeSubmissionDTO {
        return {
            id: challengeSubmission.id,
            userId: challengeSubmission.userId,
            projectFile: ProjectSerializer.serialize(challengeSubmission.project),
            evaluationResult: challengeSubmission.evaluationResult
        };
    }

    private fromDTO(dto: ChallengeSubmissionDTO): ChallengeSubmission {
        return {
            id: dto.id,
            userId: dto.userId,
            project: ProjectDeserializer.deserialize(dto.projectFile, []),
            evaluationResult: dto.evaluationResult
        };
    }
}

interface ChallengeSubmissionDTO {
    readonly id: number;
    readonly userId: string;
    readonly projectFile: string;
    readonly evaluationResult: ChallengeSubmissionEvaluationResult | null;
}
