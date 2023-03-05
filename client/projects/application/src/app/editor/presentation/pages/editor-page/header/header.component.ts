import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Settings } from "projects/karel/src/lib/project/settings";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"]
})
export class HeaderComponent {
    @Input()
    availableEntryPoints: string[] = [];

    @Input()
    entryPoint: string = "";

    @Output()
    entryPointChange = new EventEmitter<string>();

    @Output()
    newClick = new EventEmitter<void>();

    @Output()
    openClick = new EventEmitter<void>();

    @Output()
    saveClick = new EventEmitter<void>();

    @Output()
    undoClick = new EventEmitter<void>();

    @Output()
    redoClick = new EventEmitter<void>();

    @Output()
    runClick = new EventEmitter<void>();

    @Output()
    runReadonlyClick = new EventEmitter<void>();

    @Output()
    aboutClick = new EventEmitter<void>();
}
