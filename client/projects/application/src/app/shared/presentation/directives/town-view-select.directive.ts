import { Directive, EventEmitter, HostListener, Input, Output } from "@angular/core";
import { Rectangle } from "projects/karel/src/lib/math/rectangle";
import { Vector } from "projects/karel/src/lib/math/vector";
import { ReadonlyTown } from "projects/karel/src/public-api";
import { TownViewComponent, TownViewRenderer } from "../components/town-view/town-view.component";
import { TownRegionHighlightRenderer } from "../town/town-region-highlight-renderer";

/**
 * Adds an ability to select town regions to {@link TownViewComponent}.
 */
@Directive({
    standalone: true,
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
            this.currentDrag = null;
    }

    /**
     * Event when a town region is selected.
     */
    @Output()
    readonly select = new EventEmitter<TownViewSelectionEvent>();

    private readonly renderer: TownViewRenderer = c => this.render(c);
    
    private readonly pointersHover = new Map<number, Vector>();
    private readonly pointersDown = new Set<number>();
    private currentDrag: { pointerId: number, startTile: Vector } | null = null;
    private _selectionDisabled = false;

    constructor(private readonly townView: TownViewComponent) { }

    ngOnInit() {
        const RENDERER_ORDER = 10;
        this.townView.registerRenderer(RENDERER_ORDER, this.renderer);
    }

    ngOnDestroy() {
        this.townView.unregisterRenderer(this.renderer);
    }

    @HostListener("pointerenter", ["$event"])
    onPointerEnter(event: PointerEvent) {
        this.pointersHover.set(event.pointerId, new Vector(event.offsetX, event.offsetY));
    }

    @HostListener("pointerleave", ["$event"])
    @HostListener("pointercancel", ["$event"])
    @HostListener("pointerout", ["$event"])
    onPointerLeave(event: PointerEvent) {
        this.pointersHover.delete(event.pointerId);
        this.pointersDown.delete(event.pointerId);
        if (this.currentDrag?.pointerId === event.pointerId)
            this.currentDrag = null;
    }

    @HostListener("pointermove", ["$event"])
    onPointerMove(event: PointerEvent) {
        this.pointersHover.set(event.pointerId, new Vector(event.offsetX, event.offsetY));
    }

    @HostListener("pointerdown", ["$event"])
    onPointerDown(event: PointerEvent) {
        this.pointersDown.add(event.pointerId);

        if (this.selectionDisabled || this.pointersDown.size !== 1 || (event.pointerType === "mouse" && event.button !== 0 && event.button !== 2))
            this.currentDrag = null;
        else
            this.currentDrag = { pointerId: event.pointerId, startTile: this.positionToTile(event.offsetX, event.offsetY) };

    }

    @HostListener("pointerup", ["$event"])
    onPointerUp(event: PointerEvent) {
        this.pointersDown.delete(event.pointerId);
        if (this.currentDrag?.pointerId !== event.pointerId || (event.pointerType === "mouse" && event.button !== 0 && event.button !== 2))
            return;

        if (this.townView.town === null) {
            this.currentDrag = null;
            return;
        }

        const dragEndTile = this.positionToTile(event.offsetX, event.offsetY);
        const selectedRegion = TownViewSelectDirective.getSelectedRegion(this.townView.town, this.currentDrag.startTile, dragEndTile, this.selectionMode);

        this.currentDrag = null;

        if (selectedRegion === null)
            return;

        this.select.emit({
            region: selectedRegion,
            button: event.button === 0 ? TownViewSelectionButton.primary : TownViewSelectionButton.secondary
        });
    }

    @HostListener("contextmenu")
    onContextMenu() {
        return false;
    };

    private render(context: CanvasRenderingContext2D) {
        const town = this.townView.town;
        if (town === null || this.selectionDisabled)
            return;

        if (this.currentDrag !== null) {
            const endPosition = this.pointersHover.get(this.currentDrag.pointerId)!;
            const endTile = this.positionToTile(endPosition.x, endPosition.y);
            const selectedRegion = TownViewSelectDirective.getSelectedRegion(town, this.currentDrag.startTile, endTile, this.selectionMode);
            if (selectedRegion !== null)
                TownRegionHighlightRenderer.render(context, this.townView.renderingEnvironment, selectedRegion);
        }
        else {
            for (const pointer of this.pointersHover) {
                const tile = this.positionToTile(pointer[1].x, pointer[1].y);
                if (tile.x >= 0 && tile.y >= 0 && tile.x < town.width && tile.y < town.height)
                    TownRegionHighlightRenderer.render(context, this.townView.renderingEnvironment, new Rectangle(tile.x, tile.y, 1, 1));
            }
        }
    }

    private static getSelectedRegion(town: ReadonlyTown, startTile: Vector, endTile: Vector, selectionMode: TownViewSelectionMode): Rectangle | null {
        // Start with single selection mode.
        let left = Math.floor(endTile.x);
        let top = Math.floor(endTile.y);
        let right = left + 1;
        let bottom = top + 1;

        if (selectionMode === TownViewSelectionMode.multiple && startTile !== null) {
            // Adjust so left < right and top < bottom.
            left = Math.min(left, Math.floor(startTile.x));
            right = Math.max(right, Math.floor(startTile.x) + 1);
            top = Math.min(top, Math.floor(startTile.y));
            bottom = Math.max(bottom, Math.floor(startTile.y) + 1);
        }

        // Constrain to town dimensions.
        left = Math.max(left, 0);
        right = Math.min(right, town.width);
        top = Math.max(top, 0);
        bottom = Math.min(bottom, town.height);

        const width = right - left;
        const height = bottom - top;

        if (width <= 0 || height <= 0)
            // The region is outside of the town.
            return null;

        return new Rectangle(left, top, width, height);
    }

    private positionToTile(x: number, y: number) {
        const tileX = Math.floor(this.townView.renderingEnvironment.pixelXToTileX(x));
        const tileY = Math.floor(this.townView.renderingEnvironment.pixelYToTileY(y));
        return new Vector(tileX, tileY);
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
    readonly region: Rectangle,

    /**
     * Mouse button used to select the region.
     */
    readonly button: TownViewSelectionButton
}