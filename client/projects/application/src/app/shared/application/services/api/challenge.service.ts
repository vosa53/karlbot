import { Injectable } from "@angular/core";
import { TownDeserializer } from "karel";
import { TownSerializer } from "karel";
import { Challenge } from "../../models/challenge";
import { ChallengeDifficulty } from "../../models/challenge-difficulty";
import { ChallengeSubmissionsInfo } from "../../models/challenge-submissions.info";
import { APIService } from "./api-service";

/**
 * Service for managing challenges.
 */
@Injectable({
    providedIn: "root"
})
export class ChallengeService {
    private readonly BASE_URL = "/Challenges";

    /**
     * @param apiService Service for server API communication.
     */
    constructor(private readonly apiService: APIService) { }

    /**
     * Returns all challenges.
     */
    async get(): Promise<Challenge[]> {
        const dto = await this.apiService.get<ChallengeDTO[]>(this.BASE_URL);
        return dto.map(d => this.fromDTO(d));
    }

    /**
     * Returns a challenge by its ID.
     * @param id Challenge ID.
     */
    async getById(id: string): Promise<Challenge> {
        const url = `${this.BASE_URL}/${id}`;
        const dto = await this.apiService.get<ChallengeDTO>(url);
        return this.fromDTO(dto);
    }

    /**
     * Creates a new challenge.
     * @param challenge Challenge.
     */
    async add(challenge: Challenge): Promise<Challenge> {
        const dto = this.toDTO(challenge);
        const dtoResult = await this.apiService.post<ChallengeDTO>(this.BASE_URL, dto);
        return this.fromDTO(dtoResult);
    }

    /**
     * Updates a challenge.
     * @param challenge New challenge data.
     */
    async update(challenge: Challenge): Promise<any> {
        const dto = this.toDTO(challenge);
        const url = `${this.BASE_URL}/${challenge.id}`;
        await this.apiService.put(url, dto);
    }

    /**
     * Deletes a challenge.
     * @param challenge Challenge.
     */
    async delete(challenge: Challenge): Promise<any> {
        const url = `${this.BASE_URL}/${challenge.id}`;
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