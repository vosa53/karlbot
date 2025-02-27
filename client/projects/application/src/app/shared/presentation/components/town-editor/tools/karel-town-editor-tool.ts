import { TownViewSelectionEvent, TownViewSelectionMode } from "projects/application/src/app/shared/presentation/directives/town-view-select.directive";
import { Vector } from "karel";
import { TownDirectionUtils } from "karel";
import { MutableTown } from "karel";
import { TownTile } from "karel";
import { TownEditorTool } from "./town-editor-tool";

/**
 * Tool for placing Karel in a town editor.
 */
export class KarelTownEditorTool extends TownEditorTool {
    constructor() {
        super(TownViewSelectionMode.single);
    }

    /** @inheritdoc */
    onSelect(event: TownViewSelectionEvent, town: MutableTown): void {
        const isSamePosition = event.region.x === town.karelPosition.x && event.region.y === town.karelPosition.y;
        if (isSamePosition)
            this.rotateKarel(town);
        else
            this.moveKarel(town, event.region.x, event.region.y);
    }

    private rotateKarel(town: MutableTown) {
        let { x, y } = TownDirectionUtils.toVector(town.karelDirection);
        [x, y] = [y, -x];
        town.karelDirection = TownDirectionUtils.fromVector(x, y);
    }

    private moveKarel(town: MutableTown, tileX: number, tileY: number) {
        const tile = town.getTileAt(tileX, tileY);
        if (tile === TownTile.land)
            town.karelPosition = new Vector(tileX, tileY);
    }
}