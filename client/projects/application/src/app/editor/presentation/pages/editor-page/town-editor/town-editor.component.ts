import { Component } from "@angular/core";
import { MutableTown } from "projects/karel/src/lib/town/mutable-town";

@Component({
    selector: "app-town-editor",
    templateUrl: "./town-editor.component.html",
    styleUrls: ["./town-editor.component.css"]
})
export class TownEditorComponent {
    town = MutableTown.createEmpty(10, 10);
}
