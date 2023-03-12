import { TownViewSelectionButton, TownViewSelectionEvent, TownViewSelectionMode } from "projects/application/src/app/shared/presentation/directives/town-view-select.directive";
import { MutableTown } from "projects/karel/src/lib/town/town";
import { TownTile } from "projects/karel/src/lib/town/town-tile";
import { TownEditorTool } from "./town-editor-tool";

/**
 * Tool for placing tiles in a town editor.
 */
export class TileTownEditorTool extends TownEditorTool {
    /**
     * @param tile Tile which the tool should place.
     */
    constructor(private readonly tile: TownTile) {
        super(TownViewSelectionMode.multiple);
    }

    /** @inheritdoc */
    onSelect(event: TownViewSelectionEvent, town: MutableTown): void {
        const region = event.region;
        for (let y = region.y; y < region.y + region.height; y++) {
            for (let x = region.x; x < region.x + region.width; x++)
                this.setTile(town, x, y, event.button);
        }
    }

    private setTile(town: MutableTown, tileX: number, tileY: number, button: TownViewSelectionButton) {
        const signCount = town.getSignCountAt(tileX, tileY);
        if (signCount !== 0)
            return;

        let setWall = this.tile === TownTile.wall;
        if (button === TownViewSelectionButton.secondary)
            setWall = !setWall;

        const tile = setWall ? TownTile.wall : TownTile.land;
        town.setTileAt(tileX, tileY, tile);
    }
}