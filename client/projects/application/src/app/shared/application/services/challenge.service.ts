import { Inject, Injectable } from '@angular/core';
import { TownDeserializer } from 'projects/karel/src/lib/town/town-deserializer';
import { TownSerializer } from 'projects/karel/src/lib/town/town-serializer';
import { API_BASE_URL } from '../api-base-url';
import { Challenge } from '../models/challenge';
import { ChallengeDifficulty } from '../models/challenge-difficulty';
import { ChallengeSubmissionsInfo } from '../models/challenge-submissions.info';
import { ApiService } from './api-service';

@Injectable({
    providedIn: 'root'
})
export class ChallengeService {
    private readonly projectsBaseUrl: string;

    constructor(private readonly apiService: ApiService, @Inject(API_BASE_URL) apiBaseUrl: string) {
        this.projectsBaseUrl = `${apiBaseUrl}/challenges`;
    }

    async get(): Promise<Challenge[]> {
        const dto = await this.apiService.get<ChallengeDTO[]>(this.projectsBaseUrl);
        return dto.map(d => this.fromDTO(d));
    }

    async getById(id: string): Promise<Challenge> {
        const url = `${this.projectsBaseUrl}/${id}`;
        const dto = await this.apiService.get<ChallengeDTO>(url);
        return this.fromDTO(dto);
    }

    async add(challenge: Challenge): Promise<Challenge> {
        const dto = this.toDTO(challenge);
        const dtoResult = await this.apiService.post<ChallengeDTO>(this.projectsBaseUrl, dto);
        return this.fromDTO(dtoResult);
    }

    async update(challenge: Challenge): Promise<any> {
        const dto = this.toDTO(challenge);
        const url = `${this.projectsBaseUrl}/${challenge.id}`;
        await this.apiService.put(url, dto);
    }

    async delete(challenge: Challenge): Promise<any> {
        const url = `${this.projectsBaseUrl}/${challenge.id}`;
        return this.apiService.delete(url);
    }

    private toDTO(challenge: Challenge): ChallengeDTO {
        return {
            id: challenge.id,
            name: challenge.name,
            description: challenge.description,
            difficulty: challenge.difficulty,
            submissionsInfo: challenge.submissionsInfo,
            testCases: challenge.testCases?.map(tc => ({
                inputTown: TownSerializer.serialize(tc.inputTown),
                outputTown: TownSerializer.serialize(tc.outputTown),
                checkKarelPosition: tc.checkKarelPosition,
                checkKarelDirection: tc.checkKarelDirection,
                checkSigns: tc.checkSigns,
                isPublic: tc.isPublic
            })) ?? null
        };
    }

    private fromDTO(dto: ChallengeDTO): Challenge {
        return {
            id: dto.id, 
            name: dto.name,
            description: dto.description,
            difficulty: dto.difficulty,
            submissionsInfo: dto.submissionsInfo,
            testCases: dto.testCases?.map(tc => ({
                inputTown: TownDeserializer.deserialize(tc.inputTown),
                outputTown: TownDeserializer.deserialize(tc.outputTown),
                checkKarelPosition: tc.checkKarelPosition,
                checkKarelDirection: tc.checkKarelDirection,
                checkSigns: tc.checkSigns,
                isPublic: tc.isPublic
            })) ?? null
        };
    }
}

interface ChallengeDTO {
    readonly id: string | null;
    readonly name: string;
    readonly description: string;
    readonly difficulty: ChallengeDifficulty;
    readonly submissionsInfo: ChallengeSubmissionsInfo | null;
    readonly testCases: ChallengeTestCaseDTO[] | null;
}

interface ChallengeTestCaseDTO {
    readonly inputTown: string;
    readonly outputTown: string;
    readonly checkKarelPosition: boolean;
    readonly checkKarelDirection: boolean;
    readonly checkSigns: boolean;
    readonly isPublic: boolean;
}