import { Project } from "karel";

/**
 * Project saved on the server.
 */
export interface SavedProject {
    /**
     * ID.
     */
    readonly id: string | null;

    /**
     * ID of the author.
     */
    readonly authorId: string;

    /**
     * Wheter it is publicly accessible or only for its author.
     */
    readonly isPublic: boolean;

    /**
     * Date and time when the project was created.
     */
    readonly created: Date;

    /**
     * Date and time of the last project modification.
     */
    readonly modified: Date;

    /**
     * Project.
     */
    readonly project: Project;
}