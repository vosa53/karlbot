import { TownDirectionUtils } from "karel";
import { TownTile } from "karel";
import { ReadonlyTown } from "karel";
import { TownRenderingEnvironment } from "./town-rendering-environment";

/**
 * Renders a town on canvas.
 */
export class TownRenderer {
    private static readonly imageLoadPromises: Promise<void>[] = [];
    private static imagesLoadPromise: Promise<void[]>;

    private static readonly karelImage = this.loadImage("karel.png");
    private static readonly homeImage = this.loadImage("home.png");
    private static readonly wallTileImage = this.loadImage("tiles/wall-tile.png");
    private static readonly landTileImage = this.loadImage("tiles/land-tile.png");
    private static readonly signEvenImage = this.loadImage("signs/sign-even.png");
    private static readonly signOddImage = this.loadImage("signs/sign-odd.png");

    static {
        this.imagesLoadPromise = Promise.all(this.imageLoadPromises);
    }

    static async waitForImagesLoad() {
        await this.imagesLoadPromise;
    }

    /**
     * Renders the given town to the given canvas rendering context. 
     * @param context Canvas rendering context.
     * @param environment Rendering environment.
     * @param town Town to render.
     */
    static render(context: CanvasRenderingContext2D, environment: TownRenderingEnvironment, town: ReadonlyTown) {
        TownRenderer.renderTiles(context, environment, town);
        TownRenderer.renderKarel(context, environment, town);
        TownRenderer.renderHome(context, environment, town);
    }

    private static renderTiles(context: CanvasRenderingContext2D, environment: TownRenderingEnvironment, town: ReadonlyTown) {
        const signHeight = environment.tilePixelSize / 8;

        const visibleTileRegion = environment.getVisibleTileRegion();

        const left = Math.max(Math.floor(visibleTileRegion.x), 0);
        const top = Math.max(Math.floor(visibleTileRegion.y), 0);

        const right = Math.min(Math.ceil(visibleTileRegion.x + visibleTileRegion.width), town.width);
        const bottom = Math.min(Math.ceil(visibleTileRegion.y + visibleTileRegion.height), town.height);

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

    private static renderHome(context: CanvasRenderingContext2D, environment: TownRenderingEnvironment, town: ReadonlyTown) {
        const positionX = environment.tileXToPixelX(town.homePosition.x);
        const positionY = environment.tileYToPixelY(town.homePosition.y);

        context.drawImage(this.homeImage, positionX, positionY, environment.tilePixelSize, environment.tilePixelSize);
    }

    private static renderKarel(context: CanvasRenderingContext2D, environment: TownRenderingEnvironment, town: ReadonlyTown) {
        const positionX = environment.tileXToPixelX(town.karelPosition.x);
        const positionY = environment.tileYToPixelY(town.karelPosition.y);
        const directionVector = TownDirectionUtils.toVector(town.karelDirection);
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

    private static loadImage(filePath: string): HTMLImageElement {
        const ASSETS_ROOT = "/assets/shared/presentation/components/town-view/";

        const image = new Image();
        const imageLoadPromise = new Promise<void>(resolve => image.addEventListener("load", () => resolve()));
        image.src = ASSETS_ROOT + filePath;
        this.imageLoadPromises.push(imageLoadPromise);
        return image;
    }
}