import { Vector } from "../math/vector";
import { Town } from "../town/town";

/**
 * Deserializes a town.
 */
export class TownDeserializer {
    /**
     * Deserializes the given town.
     * @param town Town.
     */
    static deserialize(text: string): Town {
        const serialized = JSON.parse(text);

        return this.deserializeTown(serialized);
    }

    /**
     * Deserializes the given town in a javascript object.
     * @param town Town.
     */
    static deserializeTown(town: any): Town {
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