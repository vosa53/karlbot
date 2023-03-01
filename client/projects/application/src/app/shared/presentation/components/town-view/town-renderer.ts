import { DirectionUtils } from "projects/karel/src/lib/town/direction-utils";
import { MutableTown } from "projects/karel/src/lib/town/mutable-town";
import { TownTile } from "projects/karel/src/lib/town/town-tile";
import { TownRenderingEnvironment } from "./town-rendering-environment";

/**
 * Renders {@link MutableTown} on canvas.
 */
export class TownRenderer {
    private static readonly karelImage = new Image();
    private static readonly homeImage = new Image();
    private static readonly wallTileImage = new Image();
    private static readonly landTileImage = new Image();
    private static readonly signEvenImage = new Image();
    private static readonly signOddImage = new Image();

    static {
        const assetsRoot = "/assets/shared/presentation/components/town-view/";
        this.karelImage.src = assetsRoot + "karel.png";
        this.homeImage.src = assetsRoot + "home.png";
        this.wallTileImage.src = assetsRoot + "tiles/wall-tile.png";
        this.landTileImage.src = assetsRoot + "tiles/land-tile.png";
        this.signEvenImage.src = assetsRoot + "signs/sign-even.png";
        this.signOddImage.src = assetsRoot + "signs/sign-odd.png";
    }

    /**
     * Renders the given town to the given canvas rendering context. 
     * @param context Canvas rendering context.
     * @param town Town to render.
     * @param environment Rendering environment.
     */
    static render(context: CanvasRenderingContext2D, town: MutableTown, environment: TownRenderingEnvironment) {
        TownRenderer.renderTiles(context, town, environment);
        TownRenderer.renderKarel(context, town, environment);
        TownRenderer.renderHome(context, town, environment);
    }

    private static renderTiles(context: CanvasRenderingContext2D, town: MutableTown, environment: TownRenderingEnvironment) {
        const signHeight = environment.tilePixelSize / 8;

        const visibleTileRegion = environment.getVisibleTileRegion();

        const left = Math.max(Math.floor(visibleTileRegion.left), 0);
        const top = Math.max(Math.floor(visibleTileRegion.top), 0);

        const right = Math.min(Math.ceil(visibleTileRegion.right), town.width);
        const bottom = Math.min(Math.ceil(visibleTileRegion.bottom), town.height);

        for (let y = top; y < bottom; y++) {
            for (let x = left; x < right; x++) {
                const tile = town.getTileAt(x, y);
                const positionX = environment.tileXToPixelX(x);
                const positionY = environment.tileYToPixelY(y);
                const image = TownRenderer.getTileImage(tile);

                context.drawImage(image, positionX, positionY, environment.tilePixelSize, environment.tilePixelSize);

                const signCount = town.getSignCountAt(x, y);
                for (let i = 0; i < signCount; i++) {
                    const signImage = i % 2 === 0 ? TownRenderer.signEvenImage : TownRenderer.signOddImage;
                    context.drawImage(signImage, positionX, positionY + (8 - (i + 1)) * signHeight, environment.tilePixelSize, signHeight);
                }
            }
        }
    }

    private static renderHome(context: CanvasRenderingContext2D, town: MutableTown, environment: TownRenderingEnvironment) {
        const positionX = environment.tileXToPixelX(town.homeX);
        const positionY = environment.tileYToPixelY(town.homeY);

        context.drawImage(this.homeImage, positionX, positionY, environment.tilePixelSize, environment.tilePixelSize);
    }

    private static renderKarel(context: CanvasRenderingContext2D, town: MutableTown, environment: TownRenderingEnvironment) {
        const positionX = environment.tileXToPixelX(town.karelX);
        const positionY = environment.tileYToPixelY(town.karelY);
        const directionVector = DirectionUtils.toVector(town.karelDirection);
        const rotation = Math.atan2(directionVector.y, directionVector.x);
        const rotationOriginX = positionX + environment.tilePixelSize * 0.5;
        const rotationOriginY = positionY + environment.tilePixelSize * 0.5;

        context.translate(rotationOriginX, rotationOriginY);
        context.rotate(rotation);
        context.drawImage(this.karelImage, environment.tilePixelSize * -0.5, environment.tilePixelSize * -0.5, environment.tilePixelSize, environment.tilePixelSize);
        context.rotate(-rotation);
        context.translate(-rotationOriginX, -rotationOriginY);
    }

    private static getTileImage(tile: TownTile): HTMLImageElement {
        if (tile === TownTile.wall)
            return TownRenderer.wallTileImage;
        else if (tile === TownTile.land)
            return TownRenderer.landTileImage;
        else
            throw new Error("Unknown tile.");
    }
}