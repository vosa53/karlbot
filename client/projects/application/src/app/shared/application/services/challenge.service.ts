import { Inject, Injectable } from '@angular/core';
import { API_BASE_URL } from '../api-base-url';
import { Challenge } from '../models/challenge';
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

    async getById(id: number): Promise<Challenge> {
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
            evaluationCode: challenge.evaluationCode ?? undefined
        };
    }

    private fromDTO(dto: ChallengeDTO): Challenge {
        return {
            id: dto.id, 
            name: dto.name,
            description: dto.description,
            evaluationCode: dto.evaluationCode ?? null
        };
    }
}

interface ChallengeDTO {
    id: number;
    name: string;
    description: string;
    evaluationCode?: string;
}