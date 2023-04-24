import { Inject, Injectable } from '@angular/core';
import { ProjectDeserializer, ProjectSerializer } from "karel";
import { API_BASE_URL } from "./api-service";
import { SavedProject } from '../../models/saved-project';
import { APIService } from './api-service';

@Injectable({
    providedIn: 'root'
})
export class ProjectService {
    private readonly BASE_URL = "/Projects";

    constructor(private readonly apiService: APIService) { }

    async get(authorId?: string): Promise<SavedProject[]> {
        const params: any = { };
        if (authorId !== undefined)
            params.authorId = authorId;

        const dto = await this.apiService.get<ProjectDTO[]>(this.BASE_URL, { params });
        return dto.map(d => this.fromDTO(d));
    }

    async getById(id: string): Promise<SavedProject> {
        const url = `${this.BASE_URL}/${id}`;
        const dto = await this.apiService.get<ProjectDTO>(url);
        return this.fromDTO(dto);
    }

    async add(project: SavedProject): Promise<SavedProject> {
        const dto = this.toDTO(project);
        const dtoResult = await this.apiService.post<ProjectDTO>(this.BASE_URL, dto);
        return this.fromDTO(dtoResult);
    }

    async update(project: SavedProject): Promise<any> {
        const dto = this.toDTO(project);
        const url = `${this.BASE_URL}/${project.id}`;
        await this.apiService.put(url, dto);
    }

    async delete(project: SavedProject): Promise<any> {
        const url = `${this.BASE_URL}/${project.id}`;
        return this.apiService.delete(url);
    }

    private toDTO(savedProject: SavedProject): ProjectDTO {
        return {
            id: savedProject.id, 
            authorId: savedProject.authorId,
            isPublic: savedProject.isPublic,
            created: savedProject.created.toISOString(),
            modified: savedProject.modified.toISOString(),
            projectFile: ProjectSerializer.serialize(savedProject.project)
        };
    }

    private fromDTO(dto: ProjectDTO): SavedProject {
        return {
            id: dto.id, 
            authorId: dto.authorId,
            isPublic: dto.isPublic,
            created: new Date(dto.created),
            modified: new Date(dto.modified),
            project: ProjectDeserializer.deserialize(dto.projectFile, [])
        };
    }
}

interface ProjectDTO {
    readonly id: string | null;
    readonly authorId: string;
    readonly isPublic: boolean;
    readonly created: string;
    readonly modified: string;
    readonly projectFile: string;
}