import { Compilation } from '../compiler/compilation';
import { ExternalProgramReference } from '../compiler/external-program-reference';
import { CodeFile } from './code-file';
import { File } from './file';
import { Settings } from './settings';

/**
 * Karel project.
 */
export class Project {
    /**
     * Name.
     */
    readonly name: string;

    /**
     * Files.
     */
    readonly files: readonly File[];

    /**
     * References to external programs.
     */
    readonly externalPrograms: readonly ExternalProgramReference[];

    /**
     * Settings.
     */
    readonly settings: Settings;

    /**
     * Compilation build from the karel source files.
     */
    readonly compilation: Compilation;

    private constructor(name: string, files: readonly File[], externalPrograms: readonly ExternalProgramReference[],
        settings: Settings, compilation: Compilation) {
        this.name = name;
        this.files = files;
        this.externalPrograms = externalPrograms;
        this.settings = settings;
        this.compilation = compilation;
    }

    /**
     * Creates a new project from the given files and external programs.
     * @param name Name.
     * @param files Files.
     * @param externalPrograms References to external programs.
     * @param settings Settings.
     */
    static create(name: string, files: readonly File[], externalPrograms: readonly ExternalProgramReference[], settings: Settings) {
        const compilationUnits = files.filter(f => f instanceof CodeFile).map(f => (<CodeFile>f).compilationUnit);
        const compilation = new Compilation(compilationUnits, externalPrograms);
        return new Project(name, files, externalPrograms, settings, compilation);
    }

    /**
     * Creates a new project with replaced name.
     * @param name A new name.
     */
    withName(name: string): Project {
        return new Project(name, this.files, this.externalPrograms, this.settings, this.compilation);
    }

    /**
     * Creates a new project with added file.
     * @param file File to add.
     */
    addFile(file: File) {
        const newFiles = [...this.files, file];
        const newCompilation = file instanceof CodeFile ? this.compilation.addCompilationUnit(file.compilationUnit) : this.compilation;
        return new Project(this.name, newFiles, this.externalPrograms, this.settings, newCompilation);
    }

    /**
     * Creates a new project with removed file.
     * @param file File to remove.
     */
    removeFile(file: File) {
        const index = this.files.indexOf(file);

        if (index === -1)
            return this;

        const newFiles = [...this.files];
        newFiles.splice(index, 1);
        const newCompilation = file instanceof CodeFile ? this.compilation.removeCompilationUnit(file.compilationUnit) : this.compilation;
        return new Project(this.name, newFiles, this.externalPrograms, this.settings, newCompilation);
    }
    
    /**
     * Creates a new project with replaced file.
     * @param oldFile File to be replaced.
     * @param newFile Replacing file.
     */
    replaceFile(oldFile: File, newFile: File): Project {
        const index = this.files.indexOf(oldFile);

        if (index === -1)
            return this;

        const newFiles = [...this.files];
        newFiles[index] = newFile;

        let newCompilation: Compilation;
        if (oldFile instanceof CodeFile && newFile instanceof CodeFile)
             newCompilation = this.compilation.replaceCompilationUnit(oldFile.compilationUnit, newFile.compilationUnit);
        else if (oldFile instanceof CodeFile)
            newCompilation = this.compilation.removeCompilationUnit(oldFile.compilationUnit);
        else if (newFile instanceof CodeFile)
            newCompilation = this.compilation.addCompilationUnit(newFile.compilationUnit);
        else
            newCompilation = this.compilation;
        
        return new Project(this.name, newFiles, this.externalPrograms, this.settings, newCompilation);
    }
    
    /**
     * Creates a new project with replaced external programs.
     * @param externalPrograms New external programs.
     */
    withExternalPrograms(externalPrograms: readonly ExternalProgramReference[]): Project {
        const newCompilation = this.compilation.withExternalPrograms(externalPrograms);
        return new Project(this.name, this.files, this.externalPrograms, this.settings, newCompilation);
    }

    /**
     * Creates a new project with replaced settings.
     * @param settings A new settings.
     */
    withSettings(settings: Settings): Project {
        return new Project(this.name, this.files, this.externalPrograms, settings, this.compilation);
    }
}