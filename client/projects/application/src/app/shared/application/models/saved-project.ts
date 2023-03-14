import { Project } from "projects/karel/src/public-api";

export interface SavedProject {
    readonly id: number;
    readonly authorId: string;
    readonly isPublic: boolean;
    readonly created: Date;
    readonly modified: Date;
    readonly project: Project;
}