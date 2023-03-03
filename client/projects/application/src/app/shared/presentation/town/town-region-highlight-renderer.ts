import { TownRenderingEnvironment } from "./town-rendering-environment";
import { Rectangle } from "../../../../../../karel/src/lib/math/rectangle";

/**
 * Renders a highlight of a town region on canvas.
 */
export class TownRegionHighlightRenderer {
    /**
     * Renders a highlight of the given town region to the given canvas rendering context. 
     * @param context Canvas rendering context.
     * @param environment Rendering environment.
     * @param region Town region to render. In tile coordinates.
     */
    static render(context: CanvasRenderingContext2D, environment: TownRenderingEnvironment, region: Rectangle) {
        const pixelX = environment.tileXToPixelX(region.x);
        const pixelY = environment.tileYToPixelY(region.y);
        const pixelWidth = region.width * environment.tilePixelSize;
        const pixelHeight = region.height * environment.tilePixelSize;

        context.fillStyle = "rgb(0, 0, 0, 0.3)";
        context.fillRect(pixelX, pixelY, pixelWidth, pixelHeight);
    }
}