import { TownViewSelectionEvent, TownViewSelectionMode } from "projects/application/src/app/shared/presentation/directives/town-view-select.directive";
import { MutableTown } from "projects/karel/src/lib/town/mutable-town";

/**
 * Town editor tool.
 */
export abstract class TownEditorTool {
    /**
     * Selection mode that the tool requires or `null` when the tool does not want selection to be enabled.
     */
    readonly selectionMode: TownViewSelectionMode | null;

    /**
     * @param selectionMode Selection mode that the tool requires or `null` when the tool does not want selection to be enabled.
     */
    constructor(selectionMode: TownViewSelectionMode | null) {
        this.selectionMode = selectionMode;
    }

    /**
     * Called when a town region is selected.
     * @param event Selection event.
     * @param town The town whose region was selected.
     */
    abstract onSelect(event: TownViewSelectionEvent, town: MutableTown): void;
}