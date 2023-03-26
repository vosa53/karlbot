import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, ViewChild, AfterViewInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Vector } from 'projects/karel/src/lib/math/vector';
import { ReadonlyTown } from 'projects/karel/src/public-api';
import { TownCamera } from '../../town/town-camera';
import { TownRenderer } from '../../town/town-renderer';
import { TownRenderingEnvironment } from '../../town/town-rendering-environment';
import { TownViewport } from '../../town/town-viewport';

/**
 * Displays a town.
 */
@Component({
    standalone: true,
    selector: 'app-town-view',
    imports: [CommonModule],
    templateUrl: './town-view.component.html',
    styleUrls: ['./town-view.component.css']
})
export class TownViewComponent implements AfterViewInit, OnDestroy {
    /**
     * Town to display.
     */
    @Input()
    get town(): ReadonlyTown | null {
        return this._town;
    }

    set town(value: ReadonlyTown | null) {
        this.town?.changed.removeListener(this.townChangedHandler);
        value?.changed.addListener(this.townChangedHandler);

        this._town = value;
        this.requestRender();
    }

    /**
     * Camera for display.
     */
    @Input()
    get camera(): TownCamera {
        return this._camera;
    }

    set camera(value: TownCamera) {
        this._camera = value;
        this.updateRenderingEnvironment();
    }

    /**
     * Event when the camera is to be changed.
     */
    @Output()
    readonly cameraChange = new EventEmitter<TownCamera>();

    /**
     * Rendering environment.
     */
    get renderingEnvironment(): TownRenderingEnvironment {
        return this._renderingEnvironment;
    }

    private _town: ReadonlyTown | null = null;
    private _camera = new TownCamera(Vector.ZERO, 1);
    private _renderingEnvironment = new TownRenderingEnvironment(this.camera, new TownViewport(0, 0), 32);

    private readonly townChangedHandler = () => this.requestRender();

    @ViewChild("canvas", { static: true })
    private readonly canvasElementRef!: ElementRef<HTMLCanvasElement>;
    private readonly canvasResizeObserver = new ResizeObserver(() => this.updateRenderingEnvironment());
    private canvasRenderingContext: CanvasRenderingContext2D | null = null;
    private readonly renderers: { renderer: TownViewRenderer, order: number }[] = [];
    private requestAnimationFrameId: number | null = null;

    ngAfterViewInit() {
        this.registerRenderer(0, c => {
            if (this.town !== null)
                TownRenderer.render(c, this.renderingEnvironment, this.town);
        });
        this.updateRenderingEnvironment();
        this.canvasResizeObserver.observe(this.canvasElementRef.nativeElement);

        this.canvasRenderingContext = this.canvasElementRef.nativeElement.getContext("2d");
        if (this.canvasRenderingContext === null)
            throw new Error("Can not get a canvas 2d rendering context.");
        
        TownRenderer.waitForImagesLoad().then(() => this.requestRender());
    }

    ngOnDestroy(): void {
        this.town?.changed.removeListener(this.townChangedHandler);

        if (this.requestAnimationFrameId !== null)
            cancelAnimationFrame(this.requestAnimationFrameId);
        
        this.canvasResizeObserver.disconnect();
    }

    /**
     * Adds a renderer
     * @param order Rendering order. Renderers are called in ascending order.
     * @param renderer Renderer to add.
     */
    registerRenderer(order: number, renderer: TownViewRenderer) {
        this.renderers.push({ renderer, order });
        this.renderers.sort((r1, r2) => r1.order - r2.order);
    }

    /**
     * Removes a renderer.
     * @param renderer Renderer to remove.
     */
    unregisterRenderer(renderer: TownViewRenderer) {
        const rendererIndex = this.renderers.findIndex(r => r.renderer === renderer);
        if (rendererIndex !== -1)
            this.renderers.splice(rendererIndex, 1);
    }

    /**
     * Requests re-render.
     */
    requestRender() {
        if (this.requestAnimationFrameId !== null || this.canvasRenderingContext === null)
            return;

        this.requestAnimationFrameId = requestAnimationFrame(() => {
            this.render(this.canvasRenderingContext!);
            this.requestAnimationFrameId = null;
        });
    }

    private render(context: CanvasRenderingContext2D) {
        context.clearRect(0, 0, this.renderingEnvironment.viewport.pixelWidth, this.renderingEnvironment.viewport.pixelWidth);

        for (const renderer of this.renderers)
            renderer.renderer(context);
    }

    private updateRenderingEnvironment() {
        const canvasElement = this.canvasElementRef.nativeElement;
        canvasElement.width = canvasElement.offsetWidth;
        canvasElement.height = canvasElement.offsetHeight;
        this._renderingEnvironment = new TownRenderingEnvironment(this.camera, new TownViewport(canvasElement.width, canvasElement.height), 32);
        
        // Setting `width` and `height` clears the canvas.
        if (this.canvasRenderingContext !== null)
            this.render(this.canvasRenderingContext);
    }
}

/**
 * Town view renderer.
 */
export type TownViewRenderer = (context: CanvasRenderingContext2D) => void;
