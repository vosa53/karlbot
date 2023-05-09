import { MutableTown, Rectangle, TownDirection, TownTile, Vector } from "karel";
import { TownViewSelectionButton } from "../../../directives/town-view-select.directive";
import { KarelTownEditorTool } from "./karel-town-editor-tool";

describe("KarelTownEditorTool", () => {
    it("onSelect - Changes Karel position when the selected tile is land.", () => {
        const tool = new KarelTownEditorTool();
        const town = MutableTown.createEmpty(10, 10);

        tool.onSelect({ button: TownViewSelectionButton.primary, region: new Rectangle(5, 5, 1, 1) }, town);

        expect(town.karelPosition).toEqual(new Vector(5, 5));
    });

    it("onSelect - Changes Karel direction when Karel is on the selected tile.", () => {
        const tool = new KarelTownEditorTool();
        const town = MutableTown.createEmpty(10, 10);
        town.karelPosition = new Vector(3, 2);
        town.karelDirection = TownDirection.right;

        tool.onSelect({ button: TownViewSelectionButton.primary, region: new Rectangle(3, 2, 1, 1) }, town);

        expect(town.karelDirection as TownDirection).toEqual(TownDirection.up);
    });

    it("onSelect - Does nothing when the selected tile is not land.", () => {
        const tool = new KarelTownEditorTool();
        const town = MutableTown.createEmpty(10, 10);
        town.karelPosition = new Vector(3, 2);
        town.karelDirection = TownDirection.right;
        town.setTileAt(5, 5, TownTile.wall);

        tool.onSelect({ button: TownViewSelectionButton.primary, region: new Rectangle(5, 5, 1, 1) }, town);

        expect(town.karelPosition).toEqual(new Vector(3, 2));
        expect(town.karelDirection).toEqual(TownDirection.right);
    });
});