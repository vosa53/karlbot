import { Directive, EventEmitter, HostListener, Input, Output } from "@angular/core";
import { Rectangle } from "projects/karel/src/lib/math/rectangle";
import { Vector } from "projects/karel/src/lib/math/vector";
import { TownViewComponent, TownViewRenderer } from "../components/town-view/town-view.component";
import { TownRegionHighlightRenderer } from "../town/town-region-highlight-renderer";

/**
 * Adds an ability to select town regions to {@link TownViewComponent}.
 */
@Directive({
    selector: "[appTownViewSelect]"
})
export class TownViewSelectDirective {
    /**
     * Town region selection mode.
     */
    @Input()
    selectionMode = TownViewSelectionMode.multiple;

    /**
     * Whether town region selecting is disabled.
     */
    @Input()
    get selectionDisabled(): boolean {
        return this._selectionDisabled;
    }

    set selectionDisabled(value: boolean) {
        this._selectionDisabled = value;
        if (value === true)
            this.dragStartTile = null;
    }

    /**
     * Event when a town region is selected.
     */
    @Output()
    readonly select = new EventEmitter<TownViewSelectionEvent>();

    private readonly renderer: TownViewRenderer = c => this.render(c);
    private dragStartTile: Vector | null = null;
    private currentMouseTile = Vector.ZERO;
    private _selectionDisabled = false;

    constructor(private readonly townView: TownViewComponent) { }

    ngOnInit() {
        const RENDERER_ORDER = 10;
        this.townView.registerRenderer(RENDERER_ORDER, this.renderer);
    }

    ngOnDestroy() {
        this.townView.unregisterRenderer(this.renderer);
    }

    @HostListener("mousedown", ["$event.button", "$event.offsetX", "$event.offsetY"])
    onMouseDown(button: number, offsetX: number, offsetY: number) {
        if (button !== 0 && button !== 2 || this.selectionDisabled)
            return;

        const tilePositionX = this.townView.renderingEnvironment.pixelXToTileX(offsetX);
        const tilePositionY = this.townView.renderingEnvironment.pixelYToTileY(offsetY);
        this.dragStartTile = new Vector(tilePositionX, tilePositionY);
        this.currentMouseTile = new Vector(tilePositionX, tilePositionY);    
    };

    @HostListener("window:mouseup", ["$event.button"])
    onMouseUp(button: number) {
        if (button !== 0 && button !== 2 || this.dragStartTile === null || this.selectionDisabled)
            return;

        const selectedRegion = this.getSelectedRegion();
        this.dragStartTile = null;

        if (selectedRegion !== null) {
            this.select.emit({
                region: selectedRegion,
                button: button === 0 ? TownViewSelectionButton.primary : TownViewSelectionButton.secondary
            });
        }
    };

    @HostListener("mousemove", ["$event.offsetX", "$event.offsetY"])
    onMouseMove(offsetX: number, offsetY: number) {
        const tilePositionX = this.townView.renderingEnvironment.pixelXToTileX(offsetX);
        const tilePositionY = this.townView.renderingEnvironment.pixelYToTileY(offsetY);

        this.currentMouseTile = new Vector(tilePositionX, tilePositionY);
    };

    @HostListener("contextmenu")
    onContextMenu() {
        return false;
    };

    private render(context: CanvasRenderingContext2D) {
        const selectedRegion = this.getSelectedRegion();

        if (selectedRegion !== null)
            TownRegionHighlightRenderer.render(context, this.townView.renderingEnvironment, selectedRegion);
    }

    private getSelectedRegion(): Rectangle | null {
        if (this.townView.town === null || this.selectionDisabled)
            return null;

        // Start with single selection mode.
        let left = Math.floor(this.currentMouseTile.x);
        let top = Math.floor(this.currentMouseTile.y);
        let right = left + 1;
        let bottom = top + 1;

        if (this.selectionMode === TownViewSelectionMode.multiple && this.dragStartTile !== null) {
            // Adjust so left < right and top < bottom.
            left = Math.min(left, Math.floor(this.dragStartTile.x));
            right = Math.max(right, Math.floor(this.dragStartTile.x) + 1);
            top = Math.min(top, Math.floor(this.dragStartTile.y));
            bottom = Math.max(bottom, Math.floor(this.dragStartTile.y) + 1);
        }

        // Constrain to town dimensions.
        left = Math.max(left, 0);
        right = Math.min(right, this.townView.town.width);
        top = Math.max(top, 0);
        bottom = Math.min(bottom, this.townView.town.height);

        const width = right - left;
        const height = bottom - top;

        if (width <= 0 || height <= 0)
            // The region is outside of the town.
            return null;

        return new Rectangle(left, top, width, height);
    }
}

/**
 * Town region selection mode in {@link TownViewComponent}.
 */
export enum TownViewSelectionMode {
    /**
     * Single tile.
     */
    single,

    /**
     * Multiple tiles.
     */
    multiple
}

/**
 * Mouse buttons in {@link TownViewComponent}.
 */
export enum TownViewSelectionButton {
    /**
     * Primary button.
     */
    primary,

    /**
     * Secondary button.
     */
    secondary
}

/**
 * Event when a town region in {@link TownViewComponent} is selected.
 */
export interface TownViewSelectionEvent {
    /**
     * Selected town region in tile coordinates.
     */
    region: Rectangle,

    /**
     * Mouse button used to select the region.
     */
    button: TownViewSelectionButton
}