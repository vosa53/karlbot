import { Component, ElementRef, Input, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MutableTown } from 'projects/karel/src/lib/town/mutable-town';
import { TownCamera } from './town-camera';
import { TownRenderer } from './town-renderer';
import { TownRenderingEnvironment } from './town-rendering-environment';
import { TownViewport } from './town-viewport';

/**
 * Component displaying a town.
 */
@Component({
    selector: 'app-town-view',
    templateUrl: './town-view.component.html',
    styleUrls: ['./town-view.component.css']
})
export class TownViewComponent implements AfterViewInit, OnDestroy {
    /**
     * Town to display.
     */
    @Input()
    town: MutableTown | null = null;

    /**
     * Camera for rendering.
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
     * Rendering environment.
     */
    get renderingEnvironment(): TownRenderingEnvironment {
        return this._renderingEnvironment;
    }

    @ViewChild("canvas", { static: true })
    private readonly canvasElementRef!: ElementRef<HTMLCanvasElement>;

    private _camera = new TownCamera(0, 0, 1);
    private _renderingEnvironment = new TownRenderingEnvironment(this.camera, new TownViewport(0, 0), 32);

    private requestAnimationFrameId: number | null = null;
    private readonly renderers: { renderer: TownViewRenderer, order: number }[] = [];

    constructor() {
        this.registerRenderer(c => {
            if (this.town !== null)
                TownRenderer.render(c, this.town, this.renderingEnvironment), 0
        }, 0);
    }

    ngAfterViewInit() {
        this.updateCanvasSize();
        this.updateRenderingEnvironment();

        const canvasElement = this.canvasElementRef.nativeElement;
        const canvasContext = canvasElement.getContext("2d");
        if (canvasContext === null)
            throw new Error("Can not get a canvas 2d rendering context.")

        const animationFrameCallback = () => {
            this.render(canvasContext);
            this.requestAnimationFrameId = requestAnimationFrame(animationFrameCallback);

        };
        this.requestAnimationFrameId = requestAnimationFrame(animationFrameCallback);
    }

    ngOnDestroy(): void {
        if (this.requestAnimationFrameId !== null)
            cancelAnimationFrame(this.requestAnimationFrameId);
    }

    /**
     * Adds a renderer
     * @param renderer Renderer to add.
     * @param order Rendering order. Renderers are called in ascending order.
     */
    registerRenderer(renderer: TownViewRenderer, order: number) {
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

    private render(context: CanvasRenderingContext2D) {
        context.clearRect(0, 0, this.renderingEnvironment.viewport.pixelWidth, this.renderingEnvironment.viewport.pixelWidth);

        for (const renderer of this.renderers)
            renderer.renderer(context);
    }

    private updateCanvasSize() {
        const canvasElement = this.canvasElementRef.nativeElement;
        canvasElement.width = canvasElement.offsetWidth;
        canvasElement.height = canvasElement.offsetHeight;
    }

    private updateRenderingEnvironment() {
        const canvasElement = this.canvasElementRef.nativeElement;
        this._renderingEnvironment = new TownRenderingEnvironment(this.camera, new TownViewport(canvasElement.width, canvasElement.height), 32);
    }
}

/**
 * Town view renderer.
 */
export type TownViewRenderer = (context: CanvasRenderingContext2D) => void;
