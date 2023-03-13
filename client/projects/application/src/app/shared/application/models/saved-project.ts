import { Project } from "karel";

export interface SavedProject {
    readonly id: number;
    readonly authorId: string;
    readonly isPublic: boolean;
    readonly created: Date;
    readonly modified: Date;
    readonly projectFile: string;
}