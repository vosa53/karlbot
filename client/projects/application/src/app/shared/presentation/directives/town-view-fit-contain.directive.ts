import { Directive, ElementRef, AfterViewInit, OnDestroy } from "@angular/core";
import { TownViewComponent } from "../components/town-view/town-view.component";
import { TownCameraFactory } from "../town/town-camera-factory";

/**
 * Adjust the camera so that the town is whole contained in the viewport.
 */
@Directive({
    standalone: true,
    selector: "[appTownViewFitContain]"
})
export class TownViewFitContainDirective implements AfterViewInit, OnDestroy {
    private readonly resizeObserver = new ResizeObserver(() => this.updateCamera());

    constructor(private readonly townView: TownViewComponent, private readonly elementRef: ElementRef) { }

    ngAfterViewInit(): void {
        this.resizeObserver.observe(this.elementRef.nativeElement);
        this.updateCamera();
    }

    ngOnDestroy(): void {
        this.resizeObserver.disconnect();
    }

    private updateCamera() {
        if (this.townView.town === null)
            return;
        
        this.townView.camera = TownCameraFactory.fitContain(
            this.townView.renderingEnvironment.viewport.pixelWidth, 
            this.townView.renderingEnvironment.viewport.pixelHeight,
            this.townView.town.width,
            this.townView.town.height,
            this.townView.renderingEnvironment.originalTilePixelSize
        );
    }
}
