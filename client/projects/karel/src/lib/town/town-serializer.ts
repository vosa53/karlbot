import { Town } from "./town";

/**
 * Serializes a town.
 */
export class TownSerializer {
    /**
     * Serializes the given town.
     * @param town Town.
     */
    static serialize(town: Town): string {
        const serialized = this.serializeTown(town);

        return JSON.stringify(serialized);
    }

    /**
     * Serializes the given town into a javascript object.
     * @param town Town.
     */
    static serializeTown(town: Town): any {
        return {
            width: town.width,
            height: town.height,
            karelPosition: {
                x: town.karelPosition.x,
                y: town.karelPosition.y
            },
            karelDirection: town.karelDirection,
            homePosition: {
                x: town.homePosition.x,
                y: town.homePosition.y
            },
            tiles: town.getTiles(),
            signCounts: town.getSignCounts()
        };
    }
}