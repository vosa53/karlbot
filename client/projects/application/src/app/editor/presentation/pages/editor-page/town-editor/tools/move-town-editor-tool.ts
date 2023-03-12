import { TownViewSelectionEvent, TownViewSelectionMode } from "projects/application/src/app/shared/presentation/directives/town-view-select.directive";
import { MutableTown } from "projects/karel/src/lib/town/town";
import { TownEditorTool } from "./town-editor-tool";

/**
 * Tool for moving a camera in a town editor.
 */
export class MoveTownEditorTool extends TownEditorTool {
    constructor() {
        super(null);
    }

    /** @inheritdoc */
    onSelect(event: TownViewSelectionEvent, town: MutableTown): void {

    }
}