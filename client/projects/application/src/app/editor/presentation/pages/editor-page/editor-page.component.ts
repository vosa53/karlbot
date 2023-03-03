import { Component } from "@angular/core";
import { TownCamera } from "projects/application/src/app/shared/presentation/town/town-camera";
import { Vector } from "projects/karel/src/lib/math/vector";
import { MutableTown } from "projects/karel/src/lib/town/mutable-town";

@Component({
    selector: "app-editor-page",
    templateUrl: "./editor-page.component.html",
    styleUrls: ["./editor-page.component.css"]
})
export class EditorPageComponent {
    town = MutableTown.createEmpty(10, 10);
    camera = new TownCamera(Vector.ZERO, 1);
}
