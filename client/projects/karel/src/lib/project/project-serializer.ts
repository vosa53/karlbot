import { Town } from "../town/town";
import { TownSerializer } from "../town/town-serializer";
import { CodeFile } from "./code-file";
import { File } from "./file";
import { Project } from "./project";
import { Settings } from "./settings";
import { TownFile } from "./town-file";

/**
 * Serializes a Karel project.
 */
export class ProjectSerializer {
    /**
     * Serializes the given Karel project.
     * @param project Karel project.
     */
    static serialize(project: Project): string {
        const serialized = this.serializeProject(project);

        return JSON.stringify(serialized);
    }

    private static serializeProject(project: Project): any {
        return {
            name: project.name,
            settings: this.serializeSettings(project.settings),
            files: project.files.map(f => this.serializeFile(f))
        };
    }

    private static serializeSettings(settings: Settings): any {
        return {
            entryPoint: settings.entryPoint,
            karelSpeed: settings.karelSpeed,
            maxRecursionDepth: settings.maxRecursionDepth
        };
    }

    private static serializeFile(file: File): any {
        if (file instanceof CodeFile)
            return this.serializeCodeFile(file);
        else if (file instanceof TownFile)
            return this.serializeTownFile(file);
        else
            throw new Error("Not supported.");
    }

    private static serializeCodeFile(file: CodeFile): any {
        return {
            type: "code",
            name: file.name,
            code: file.compilationUnit.buildText(),
            breakpoints: file.breakpoints
        };
    }

    private static serializeTownFile(file: TownFile): any {
        return {
            type: "town",
            name: file.name,
            town: TownSerializer.serializeTown(file.town)
        };
    }
}