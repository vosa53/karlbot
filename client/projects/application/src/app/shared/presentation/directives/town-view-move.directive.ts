import { Directive, HostListener, ElementRef } from "@angular/core";
import { Vector } from "projects/karel/src/lib/math/vector";
import { TownViewComponent } from "../components/town-view/town-view.component";
import { TownCamera } from "../town/town-camera";

/**
 * Adds an ability to move the camera to {@link TownViewComponent}.
 */
@Directive({
    selector: "[appTownViewMove]"
})
export class TownViewMoveDirective {
    private isDragging = false;

    constructor(private readonly townView: TownViewComponent) { }

    @HostListener("mousemove", ["$event.movementX", "$event.movementY"])
    onMouseMove(movementX: number, movementY: number) {
        if (!this.isDragging)
            return;

        const newCenterTileX = this.townView.camera.centerTile.x - movementX / this.townView.renderingEnvironment.tilePixelSize;
        const newCenterTileY = this.townView.camera.centerTile.y - movementY / this.townView.renderingEnvironment.tilePixelSize;
        const newCenterTile = new Vector(newCenterTileX, newCenterTileY);

        const newCamera = new TownCamera(newCenterTile, this.townView.camera.zoomLevel);
        this.townView.cameraChange.emit(newCamera);
    };

    @HostListener("mousedown", ["$event.button"])
    onMouseDown(button: number) {
        if (button !== 1)
            return false;

        this.isDragging = true;

        return false;
    };

    @HostListener("window:mouseup", ["$event.button"])
    onMouseUp(button: number) {
        if (button !== 1)
            return;

        this.isDragging = false;
    };

    @HostListener("wheel", ["$event.deltaY", "$event.offsetX", "$event.offsetY"])
    onWheel(mouseDeltaY: number, offsetX: number, offsetY: number) {
        const tilePositionX = this.townView.renderingEnvironment.pixelXToTileX(offsetX);
        const tilePositionY = this.townView.renderingEnvironment.pixelYToTileY(offsetY);
        const zoom = Math.pow(1.2, mouseDeltaY / -120);

        const deltaX = this.townView.camera.centerTile.x - tilePositionX;
        const deltaY = this.townView.camera.centerTile.y - tilePositionY;

        const newCamera = new TownCamera(
            new Vector(
                tilePositionX + deltaX / zoom,
                tilePositionY + deltaY / zoom
            ),
            this.townView.camera.zoomLevel * zoom
        );
        this.townView.cameraChange.emit(newCamera);

        return false;
    };
}
