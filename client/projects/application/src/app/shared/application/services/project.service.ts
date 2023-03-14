import { Inject, Injectable } from '@angular/core';
import { ProjectDeserializer, ProjectSerializer } from 'projects/karel/src/public-api';
import { API_BASE_URL } from '../api-base-url';
import { SavedProject } from '../models/saved-project';
import { ApiService } from './api-service';

@Injectable({
    providedIn: 'root'
})
export class ProjectService {
    private readonly projectsBaseUrl: string;

    constructor(private readonly apiService: ApiService, @Inject(API_BASE_URL) apiBaseUrl: string) {
        this.projectsBaseUrl = `${apiBaseUrl}/projects`;
    }

    async get(): Promise<SavedProject[]> {
        const dto = await this.apiService.get<ProjectDTO[]>(this.projectsBaseUrl);
        return dto.map(d => this.fromDTO(d));
    }

    async getById(id: number): Promise<SavedProject> {
        const url = `${this.projectsBaseUrl}/${id}`;
        const dto = await this.apiService.get<ProjectDTO>(url);
        return this.fromDTO(dto);
    }

    async add(project: SavedProject): Promise<SavedProject> {
        const dto = this.toDTO(project);
        const dtoResult = await this.apiService.post<ProjectDTO>(this.projectsBaseUrl, dto);
        return this.fromDTO(dtoResult);
    }

    async update(project: SavedProject): Promise<any> {
        const dto = this.toDTO(project);
        const url = `${this.projectsBaseUrl}/${project.id}`;
        await this.apiService.put(url, dto);
    }

    async delete(project: SavedProject): Promise<any> {
        const url = `${this.projectsBaseUrl}/${project.id}`;
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
    readonly id: number;
    readonly authorId: string;
    readonly isPublic: boolean;
    readonly created: string;
    readonly modified: string;
    readonly projectFile: string;
}