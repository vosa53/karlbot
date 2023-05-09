import { MutableTown, Rectangle, TownTile, Vector } from "karel";
import { TownViewSelectionButton } from "../../../directives/town-view-select.directive";
import { TileTownEditorTool } from "./tile-town-editor-tool";

describe("TileTownEditorTool", () => {
    it("onSelect - Sets tiles when the button is primary.", () => {
        const tool = new TileTownEditorTool(TownTile.wall);
        const town = MutableTown.createEmpty(10, 10);
        town.setTileAt(6, 5, TownTile.wall);

        tool.onSelect({ button: TownViewSelectionButton.primary, region: new Rectangle(5, 5, 2, 2) }, town);

        expect(town.getTileAt(5, 5)).toEqual(TownTile.wall);
        expect(town.getTileAt(5, 6)).toEqual(TownTile.wall);
        expect(town.getTileAt(6, 5)).toEqual(TownTile.wall);
        expect(town.getTileAt(6, 6)).toEqual(TownTile.wall);
    });

    it("onSelect - Removes tiles when the button is secondary.", () => {
        const tool = new TileTownEditorTool(TownTile.wall);
        const town = MutableTown.createEmpty(10, 10);
        town.setTileAt(5, 5, TownTile.wall);

        tool.onSelect({ button: TownViewSelectionButton.secondary, region: new Rectangle(5, 5, 2, 1) }, town);

        expect(town.getTileAt(5, 5)).toEqual(TownTile.land);
        expect(town.getTileAt(6, 5)).toEqual(TownTile.land);
    });

    it("onSelect - Does nothing when the selected tile contains Karel, home or signs.", () => {
        const tool = new TileTownEditorTool(TownTile.wall);
        const town = MutableTown.createEmpty(10, 10);
        town.karelPosition = new Vector(5, 5);
        town.homePosition = new Vector(5, 6);
        town.setSignCountAt(6, 5, 1);

        tool.onSelect({ button: TownViewSelectionButton.primary, region: new Rectangle(5, 5, 2, 2) }, town);

        expect(town.getTileAt(5, 5)).toEqual(TownTile.land);
        expect(town.getTileAt(5, 6)).toEqual(TownTile.land);
        expect(town.getTileAt(6, 5)).toEqual(TownTile.land);
        expect(town.getTileAt(6, 6)).toEqual(TownTile.wall);
    });
});