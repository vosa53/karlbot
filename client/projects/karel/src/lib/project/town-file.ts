import { File } from "./file";
import { Town } from "../town/town";

/**
 * Town file.
 */
export class TownFile extends File {
    /** @inheritdoc */
    readonly name: string;

    /**
     * Town.
     */
    readonly town: Town;
    
    /**
     * @param name Name.
     * @param town Town.
     */
    constructor(name: string, town: Town) {
        super();
        this.name = name;
        this.town = town;
    }

    /** @inheritdoc */
    withName(name: string): TownFile {
        return new TownFile(name, this.town);
    }

    /**
     * Creates a new town file with replaced town.
     * @param town A new town.
     */
    withTown(town: Town): TownFile {
        return new TownFile(this.name, town);
    }
}