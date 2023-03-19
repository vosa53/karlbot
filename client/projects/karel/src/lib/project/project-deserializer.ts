import { ExternalProgramReference } from "../compiler/external-program-reference";
import { CompilationUnitParser } from "../compiler/syntax-analysis/compilation-unit-parser";
import { Vector } from "../math/vector";
import { Town } from "../town/town";
import { CodeFile } from "./code-file";
import { File } from "./file";
import { Project } from "./project";
import { Settings } from "./settings";
import { TownFile } from "./town-file";

/**
 * Deserializes a Karel project.
 */
export class ProjectDeserializer {
    /**
     * Deserializes the given Karel project.
     * @param project Karel project.
     * @param externalPrograms References to external programs.
     */
    static deserialize(text: string, externalPrograms: readonly ExternalProgramReference[]): Project {
        const serialized = JSON.parse(text);

        return this.deserializeProject(serialized, externalPrograms);
    }

    private static deserializeProject(project: any, externalPrograms: readonly ExternalProgramReference[]): Project {
        return Project.create(
            project.name,
            project.files.map((f: any) => this.deserializeFile(f)),
            externalPrograms,
            this.deserializeSettings(project.settings)
        );
    }

    private static deserializeSettings(settings: any): Settings {
        return new Settings(settings.entryPoint, settings.karelSpeed, settings.maxRecursionDepth);
    }

    private static deserializeFile(file: any): File {
        if (file.type === "code")
            return this.deserializeCodeFile(file);
        else if (file.type === "town")
            return this.deserializeTownFile(file);
        else
            throw new Error("Not supported.");
    }

    private static deserializeCodeFile(file: any): CodeFile {
        const compilationUnit = CompilationUnitParser.parse(file.code, file.name);
        return new CodeFile(compilationUnit, file.breakpoints);
    }

    private static deserializeTownFile(file: any): TownFile {
        const town = this.deserializeTown(file.town);
        return new TownFile(file.name, town);
    }

    private static deserializeTown(town: any): Town {
        return Town.create(
            town.width,
            town.height,
            new Vector(town.karelPosition.x, town.karelPosition.y),
            town.karelDirection,
            new Vector(town.homePosition.x, town.homePosition.y),
            town.tiles,
            town.signCounts
        );
    }
}