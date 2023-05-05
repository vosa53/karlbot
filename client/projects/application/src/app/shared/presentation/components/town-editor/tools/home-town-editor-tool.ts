import { TownViewSelectionEvent, TownViewSelectionMode } from "projects/application/src/app/shared/presentation/directives/town-view-select.directive";
import { Vector } from "karel";
import { MutableTown } from "karel";
import { TownTile } from "karel";
import { TownEditorTool } from "./town-editor-tool";

/**
 * Tool for placing a home in a town editor.
 */
export class HomeTownEditorTool extends TownEditorTool {
    constructor() {
        super(TownViewSelectionMode.single);
    }

    /** @inheritdoc */
    onSelect(event: TownViewSelectionEvent, town: MutableTown): void {
        const tile = town.getTileAt(event.region.x, event.region.y);
        if (tile === TownTile.land)
            town.homePosition = new Vector(event.region.x, event.region.y);
    }
}