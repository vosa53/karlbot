import { Directive, HostListener, ElementRef, Input } from "@angular/core";
import { Vector } from "projects/karel/src/lib/math/vector";
import { TownViewComponent } from "../components/town-view/town-view.component";
import { TownCamera } from "../town/town-camera";

/**
 * Adds an ability to move the camera to {@link TownViewComponent}.
 */
@Directive({
    standalone: true,
    selector: "[appTownViewMove]"
})
export class TownViewMoveDirective {
    /**
     * Whether the movement with anything other than mouse wheel button is disabled.
     */
    @Input()
    touchMoveDisabled = false;

    private readonly pointersDown = new Map<number, Vector>();

    constructor(private readonly townView: TownViewComponent, elementRef: ElementRef) {
        elementRef.nativeElement.style.touchAction = "none";
    }

    @HostListener("pointerdown", ["$event"])
    onPointerDown(event: PointerEvent) {
        event.preventDefault();

        this.pointersDown.set(event.pointerId, new Vector(event.offsetX, event.offsetY));
    }

    @HostListener("pointermove", ["$event"])
    onPointerMove(event: PointerEvent) {
        event.preventDefault();

        if (!this.pointersDown.has(event.pointerId))
            return;
        
        // Pinch (zoom) touch gesture.
        if (this.pointersDown.size === 2) {
            const [[, previousFirst], [, previousSecond]] = this.pointersDown.entries();
            const previousDistance = Vector.calculateDistance(previousFirst, previousSecond);
            this.pointersDown.set(event.pointerId, new Vector(event.offsetX, event.offsetY));
            const [[, first], [, second]] = this.pointersDown.entries();
            const distance = Vector.calculateDistance(first, second);

            const centerX = (first.x + second.x) / 2;
            const centerY = (first.y + second.y) / 2;
            const zoom = distance / previousDistance;
            this.zoom(centerX, centerY, zoom);
        }

        // Pan (movement) gesture.
        const isRightButtonsWhenMouse = (event.pointerType !== "mouse" || (event.buttons & 4)  !== 0 || (event.buttons & 1)  !== 0);
        const isNotDisabledOrMouseWheelButton = (!this.touchMoveDisabled || (event.pointerType === "mouse" && (event.buttons & 4) !== 0));
        if (this.pointersDown.size === 1 && isRightButtonsWhenMouse && isNotDisabledOrMouseWheelButton) {
            const previous = this.pointersDown.get(event.pointerId)!;
            const deltaX = event.offsetX - previous.x;
            const deltaY = event.offsetY - previous.y;
            this.move(deltaX, deltaY);
        }

        this.pointersDown.set(event.pointerId, new Vector(event.offsetX, event.offsetY));
    }

    @HostListener("pointerup", ["$event"])
    @HostListener("pointercancel", ["$event"])
    @HostListener("pointerout", ["$event"])
    @HostListener("pointerleave", ["$event"])
    onPointerUp(event: PointerEvent) {
        event.preventDefault();

        this.pointersDown.delete(event.pointerId);
    }

    @HostListener("wheel", ["$event"])
    onWheel(event: WheelEvent) {
        event.preventDefault();

        const zoom = Math.pow(1.2, event.deltaY / -120);
        this.zoom(event.offsetX, event.offsetY, zoom);
    };

    @HostListener("contextmenu", ["$event"])
    onContextMenu(event: MouseEvent) {
        event.preventDefault();
    };

    private move(deltaX: number, deltaY: number) {
        const newCenterTileX = this.townView.camera.centerTile.x - deltaX / this.townView.renderingEnvironment.tilePixelSize;
        const newCenterTileY = this.townView.camera.centerTile.y - deltaY / this.townView.renderingEnvironment.tilePixelSize;
        const newCenterTile = this.clampCameraCenterTile(new Vector(newCenterTileX, newCenterTileY));

        const newCamera = new TownCamera(newCenterTile, this.townView.camera.zoomLevel);
        this.townView.cameraChange.emit(newCamera);
    }

    private zoom(centerX: number, centerY: number, zoom: number) {
        const tilePositionX = this.townView.renderingEnvironment.pixelXToTileX(centerX);
        const tilePositionY = this.townView.renderingEnvironment.pixelYToTileY(centerY);

        const deltaX = this.townView.camera.centerTile.x - tilePositionX;
        const deltaY = this.townView.camera.centerTile.y - tilePositionY;

        const newCenterTile = this.clampCameraCenterTile(new Vector(
            tilePositionX + deltaX / zoom,
            tilePositionY + deltaY / zoom
        ));
        const newZoom = this.clampZoom(this.townView.camera.zoomLevel * zoom);

        if (newZoom !== this.townView.camera.zoomLevel) {
            const newCamera = new TownCamera(newCenterTile, newZoom);
            this.townView.cameraChange.emit(newCamera);
        }
    }

    private clampCameraCenterTile(centerTile: Vector) {
        const centerTileX = Math.max(0, Math.min(this.townView.town?.width ?? 0, centerTile.x));
        const centerTileY = Math.max(0, Math.min(this.townView.town?.height ?? 0, centerTile.y));
        return new Vector(centerTileX, centerTileY);
    }

    private clampZoom(zoomLevel: number) {
        const MAX_ZOOM = 8;
        const MIN_ZOOM = 1 / 8;

        return Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoomLevel));
    }
}
