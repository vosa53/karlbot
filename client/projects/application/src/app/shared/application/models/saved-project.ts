import { Project } from "karel";

export interface SavedProject {
    readonly id: string | null;
    readonly authorId: string;
    readonly isPublic: boolean;
    readonly created: Date;
    readonly modified: Date;
    readonly project: Project;
}