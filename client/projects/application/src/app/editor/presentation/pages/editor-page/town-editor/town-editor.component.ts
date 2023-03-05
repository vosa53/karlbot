import { Component, EventEmitter, Input, Output } from "@angular/core";
import { TownViewSelectionEvent, TownViewSelectionMode } from "projects/application/src/app/shared/presentation/directives/town-view-select.directive";
import { TownCamera } from "projects/application/src/app/shared/presentation/town/town-camera";
import { Vector } from "projects/karel/src/lib/math/vector";
import { MutableTown } from "projects/karel/src/lib/town/mutable-town";
import { TownTile } from "projects/karel/src/lib/town/town-tile";
import { HomeTownEditorTool } from "./tools/home-town-editor-tool";
import { KarelTownEditorTool } from "./tools/karel-town-editor-tool";
import { MoveTownEditorTool } from "./tools/move-town-editor-tool";
import { SignTownEditorTool } from "./tools/sign-town-editor-tool";
import { TileTownEditorTool } from "./tools/tile-town-editor-tool";
import { TownEditorTool } from "./tools/town-editor-tool";
import { ValidatedInputValidatorFactory } from "projects/application/src/app/shared/presentation/directives/validated-input.directive";

/**
 * Town editor.
 */
@Component({
    selector: "app-town-editor",
    templateUrl: "./town-editor.component.html",
    styleUrls: ["./town-editor.component.css"]
})
export class TownEditorComponent {
    /**
     * Town to be edited.
     */
    @Input()
    town: MutableTown | null = null;

    /**
     * Camera for town display.
     */
    @Input()
    camera = new TownCamera(Vector.ZERO, 1);

    /**
     * Event when the camera is to be changed.
     */
    @Output()
    readonly cameraChange = new EventEmitter<TownCamera>();

    /**
     * Selected tool.
     */
    selectedTool: TownEditorTool;

    /**
     * Whether selecting is disabled.
     */
    get selectionDisabled(): boolean {
        return this.selectedTool.selectionMode === null;
    }

    /**
     * Selection mode.
     */
    get selectionMode(): TownViewSelectionMode {
        return this.selectedTool.selectionMode ?? TownViewSelectionMode.single;
    }

    /**
     * Available tools with their icons.
     */
    readonly tools: readonly { iconSrc?: string, iconName?: string, tool: TownEditorTool }[];

    /**
     * Town size (width or height) validator.
     */
    readonly sizeValidator = ValidatedInputValidatorFactory.integer(s => s > 0 && s <= 100);

    constructor() {
        const assetsRoot = "/assets/editor/presentation/pages/editor/town-editor/";
        this.tools = [
            { iconName: "open_with", tool: new MoveTownEditorTool() },
            { iconSrc: assetsRoot + "karel-tool.png", tool: new KarelTownEditorTool() },
            { iconSrc: assetsRoot + "home-tool.png", tool: new HomeTownEditorTool() },
            { iconSrc: assetsRoot + "wall-tool.png", tool: new TileTownEditorTool(TownTile.wall) },
            { iconSrc: assetsRoot + "wall-tool.png", tool: new TileTownEditorTool(TownTile.land) },
            { iconSrc: assetsRoot + "sign-tool.png", tool: new SignTownEditorTool(1) },
            { iconSrc: assetsRoot + "sign-tool.png", tool: new SignTownEditorTool(-1) }
        ];
        this.selectedTool = this.tools[0].tool;
    }

    onSelect(event: TownViewSelectionEvent) {
        if (this.town !== null)
            this.selectedTool.onSelect(event, this.town);
    }

    onTownViewCameraChange(camera: TownCamera) {
        this.cameraChange.emit(camera);
    }

    onSizeChange(newWidthText?: string, newHeightText?: string) {
        if (this.town === null)
            return;

        const newWidth = newWidthText !== undefined ? window.parseInt(newWidthText, 10) : this.town.width;
        const newHeight = newHeightText !== undefined ? window.parseInt(newHeightText, 10) : this.town.height;
        this.town.resize(newWidth, newHeight);
    }
}
