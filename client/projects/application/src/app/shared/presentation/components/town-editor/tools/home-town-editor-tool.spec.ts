import { MutableTown, Rectangle, TownTile, Vector } from "karel";
import { TownViewSelectionButton } from "../../../directives/town-view-select.directive";
import { HomeTownEditorTool } from "./home-town-editor-tool";

describe("HomeTownEditorTool", () => {
    it("onSelect - Changes the home position when the selected tile is land.", () => {
        const tool = new HomeTownEditorTool();
        const town = MutableTown.createEmpty(10, 10);

        tool.onSelect({ button: TownViewSelectionButton.primary, region: new Rectangle(5, 5, 1, 1) }, town);

        expect(town.homePosition).toEqual(new Vector(5, 5));
    });

    it("onSelect - Does nothing when the selected tile is not land.", () => {
        const tool = new HomeTownEditorTool();
        const town = MutableTown.createEmpty(10, 10);
        town.setTileAt(5, 5, TownTile.wall);

        tool.onSelect({ button: TownViewSelectionButton.primary, region: new Rectangle(5, 5, 1, 1) }, town);

        expect(town.homePosition).toEqual(Vector.ZERO);
    });
});