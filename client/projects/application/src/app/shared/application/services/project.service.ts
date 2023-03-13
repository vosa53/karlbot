import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ProjectSerializer } from 'projects/karel/src/public-api';
import { map, Observable } from 'rxjs';
import { API_BASE_URL } from '../api-base-url';
import { SavedProject } from '../models/saved-project';

@Injectable({
    providedIn: 'root'
})
export class ProjectService {
    private readonly projectsBaseUrl: string;

    constructor(private readonly httpClient: HttpClient, @Inject(API_BASE_URL) apiBaseUrl: string) {
        this.projectsBaseUrl = `${apiBaseUrl}/projects`;
    }

    get(): Observable<SavedProject[]> {
        return this.httpClient.get<ProjectDTO[]>(this.projectsBaseUrl).pipe(
            map(p => p.map(p => this.fromDTO(p)))
        );
    }

    getById(id: number): Observable<SavedProject> {
        const url = `${this.projectsBaseUrl}/${id}`;
        return this.httpClient.get<ProjectDTO>(url).pipe(
            map(p => this.fromDTO(p))
        );
    }

    add(project: SavedProject): Observable<SavedProject> {
        const dto = this.toDTO(project);
        return this.httpClient.post<SavedProject>(this.projectsBaseUrl, dto);
    }

    update(project: SavedProject): Observable<any> {
        const dto = this.toDTO(project);
        const url = `${this.projectsBaseUrl}/${project.id}`;
        return this.httpClient.put(url, dto);
    }

    delete(project: SavedProject): Observable<any> {
        const url = `${this.projectsBaseUrl}/${project.id}`;
        return this.httpClient.delete(url);
    }

    private toDTO(savedProject: SavedProject): ProjectDTO {
        return {
            id: savedProject.id, 
            authorId: savedProject.authorId,
            isPublic: savedProject.isPublic,
            created: savedProject.created.toISOString(),
            modified: savedProject.modified.toISOString(),
            projectFile: savedProject.projectFile
        };
    }

    private fromDTO(dto: ProjectDTO): SavedProject {
        return {
            id: dto.id, 
            authorId: dto.authorId,
            isPublic: dto.isPublic,
            created: new Date(dto.created),
            modified: new Date(dto.modified),
            projectFile: dto.projectFile
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