/**
 * Karel project file.
 */
export abstract class File {
    /**
     * Name.
     */
    abstract get name(): string;

    /**
     * Creates a new file with replaced name.
     * @param name A new name.
     */
    abstract withName(name: string): File;
}