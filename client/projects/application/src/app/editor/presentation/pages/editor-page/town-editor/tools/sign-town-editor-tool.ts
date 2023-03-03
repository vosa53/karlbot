import { TownViewSelectionButton, TownViewSelectionEvent, TownViewSelectionMode } from "projects/application/src/app/shared/presentation/directives/town-view-select.directive";
import { MutableTown } from "projects/karel/src/lib/town/mutable-town";
import { TownTile } from "projects/karel/src/lib/town/town-tile";
import { TownEditorTool } from "./town-editor-tool";

/**
 * Tool for changing sign counts on tiles in a town editor.
 */
export class SignTownEditorTool extends TownEditorTool {
    /**
     * @param signCountDelta How many signs the tool places on a tile (or removes in case of a negative value).
     */
    constructor(private readonly signCountDelta: number) {
        super(TownViewSelectionMode.multiple);
    }

    /** @inheritdoc */
    onSelect(event: TownViewSelectionEvent, town: MutableTown): void {
        const region = event.region;
        for (let y = region.y; y < region.y + region.height; y++) {
            for (let x = region.x; x < region.x + region.width; x++)
                this.updateSigns(town, x, y, event.button);
        }
    }

    private updateSigns(town: MutableTown, tileX: number, tileY: number, button: TownViewSelectionButton) {
        const tile = town.getTileAt(tileX, tileY);
        if (tile !== TownTile.land)
            return;

        let signCount = town.getSignCountAt(tileX, tileY);

        if (button === TownViewSelectionButton.primary)
            signCount += this.signCountDelta;
        else
            signCount -= this.signCountDelta;
        
        signCount = Math.max(0, signCount);
        signCount = Math.min(MutableTown.MAX_SIGN_COUNT, signCount);
        town.setSignCountAt(tileX, tileY, signCount);
    }
}