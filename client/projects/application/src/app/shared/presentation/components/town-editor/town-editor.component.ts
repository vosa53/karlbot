import { Component, ElementRef, EventEmitter, HostBinding, HostListener, Input, Output } from "@angular/core";
import { TownViewSelectDirective, TownViewSelectionEvent, TownViewSelectionMode } from "projects/application/src/app/shared/presentation/directives/town-view-select.directive";
import { TownCamera } from "projects/application/src/app/shared/presentation/town/town-camera";
import { Vector } from "karel";
import { MutableTown } from "karel";
import { TownTile } from "karel";
import { HomeTownEditorTool } from "./tools/home-town-editor-tool";
import { KarelTownEditorTool } from "./tools/karel-town-editor-tool";
import { MoveTownEditorTool } from "./tools/move-town-editor-tool";
import { SignTownEditorTool } from "./tools/sign-town-editor-tool";
import { TileTownEditorTool } from "./tools/tile-town-editor-tool";
import { TownEditorTool } from "./tools/town-editor-tool";
import { ValidatedInputDirective, ValidatedInputValidatorFactory } from "projects/application/src/app/shared/presentation/directives/validated-input.directive";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatToolbarModule } from "@angular/material/toolbar";
import { TownViewMoveDirective } from "projects/application/src/app/shared/presentation/directives/town-view-move.directive";
import { TownViewComponent } from "projects/application/src/app/shared/presentation/components/town-view/town-view.component";
import { MatMenuModule } from "@angular/material/menu";
import { CommonModule } from "@angular/common";
import { MatInputModule } from "@angular/material/input";
import { MatBadgeModule } from "@angular/material/badge";

/**
 * Town editor.
 */
@Component({
    standalone: true,
    selector: "app-town-editor",
    imports: [CommonModule, ValidatedInputDirective, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonToggleModule, MatToolbarModule, 
        TownViewSelectDirective, TownViewMoveDirective, TownViewComponent, MatMenuModule, MatBadgeModule],
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
    readonly tools: readonly TownEditorToolButton[];

    /**
     * Town size (width or height) validator.
     */
    readonly SIZE_VALIDATOR = ValidatedInputValidatorFactory.integer(s => s > 0 && s <= 100);

    /**
     * Value of `tabindex` attribute of the component host element.
     */
    @HostBinding("attr.tabindex")
    readonly tabIndex = 0;

    constructor(private readonly hostElement: ElementRef) {
        const assetsRoot = "/assets/editor/presentation/pages/editor/town-editor/";
        this.tools = [
            { iconName: "open_with", tool: new MoveTownEditorTool() },
            { iconSrc: assetsRoot + "karel-tool.png", tool: new KarelTownEditorTool() },
            { iconSrc: assetsRoot + "home-tool.png", tool: new HomeTownEditorTool() },
            { iconSrc: assetsRoot + "wall-tool.png", action: TownEditorToolButtonAction.add, tool: new TileTownEditorTool(TownTile.wall) },
            { iconSrc: assetsRoot + "wall-tool.png", action: TownEditorToolButtonAction.remove, tool: new TileTownEditorTool(TownTile.land) },
            { iconSrc: assetsRoot + "sign-tool.png", action: TownEditorToolButtonAction.add, tool: new SignTownEditorTool(1) },
            { iconSrc: assetsRoot + "sign-tool.png", action: TownEditorToolButtonAction.remove, tool: new SignTownEditorTool(-1) }
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

    getToolButtonActionText(toolButton: TownEditorToolButton) {
        if (toolButton.action === undefined)
            return "";
        else if (toolButton.action === TownEditorToolButtonAction.add)
            return "+";
        else if (toolButton.action === TownEditorToolButtonAction.remove)
            return "-";
        else
            throw new Error();
    }

    getToolButtonActionColor(toolButton: TownEditorToolButton) {
        if (toolButton.action === undefined)
            return "primary";
        else if (toolButton.action === TownEditorToolButtonAction.add)
            return "primary";
        else if (toolButton.action === TownEditorToolButtonAction.remove)
            return "warn";
        else
            throw new Error();
    }

    @HostListener("pointerdown")
    onPointerDown() {
        this.hostElement.nativeElement.focus();
    }
}

interface TownEditorToolButton {
    readonly iconSrc?: string;
    readonly iconName?: string;
    readonly action?: TownEditorToolButtonAction;
    readonly tool: TownEditorTool
}

enum TownEditorToolButtonAction {
    add,
    remove
}