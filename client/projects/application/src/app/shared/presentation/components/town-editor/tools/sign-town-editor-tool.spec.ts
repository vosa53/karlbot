import { MutableTown, Rectangle, TownDirection, TownTile, Vector } from "karel";
import { TownViewSelectionButton } from "../../../directives/town-view-select.directive";
import { SignTownEditorTool } from "./sign-town-editor-tool";

describe("SignTownEditorTool", () => {
    it("onSelect - Adds signs when the button is primary.", () => {
        const tool = new SignTownEditorTool(4);
        const town = MutableTown.createEmpty(10, 10);
        town.setSignCountAt(5, 5, 3);
        town.setSignCountAt(5, 6, 5);
        town.setSignCountAt(6, 5, 7);
        town.setSignCountAt(6, 6, 0);

        tool.onSelect({ button: TownViewSelectionButton.primary, region: new Rectangle(5, 5, 2, 2) }, town);

        expect(town.getSignCountAt(5, 5)).toEqual(7);
        expect(town.getSignCountAt(5, 6)).toEqual(8);
        expect(town.getSignCountAt(6, 5)).toEqual(8);
        expect(town.getSignCountAt(6, 6)).toEqual(4);
    });

    it("onSelect - Removes signs when the button is secondary.", () => {
        const tool = new SignTownEditorTool(4);
        const town = MutableTown.createEmpty(10, 10);
        town.setSignCountAt(5, 5, 3);
        town.setSignCountAt(6, 5, 7);

        tool.onSelect({ button: TownViewSelectionButton.secondary, region: new Rectangle(5, 5, 2, 1) }, town);

        expect(town.getSignCountAt(5, 5)).toEqual(0);
        expect(town.getSignCountAt(6, 5)).toEqual(3);
    });

    it("onSelect - Does nothing when the selected tile is not land.", () => {
        const tool = new SignTownEditorTool(4);
        const town = MutableTown.createEmpty(10, 10);
        town.setTileAt(5, 5, TownTile.wall);

        tool.onSelect({ button: TownViewSelectionButton.primary, region: new Rectangle(5, 5, 1, 1) }, town);

        expect(town.getSignCountAt(5, 5)).toEqual(0);
    });
});