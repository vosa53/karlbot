import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatSelectModule } from "@angular/material/select";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from '@angular/material/button';
import { EditorState } from "../../../../application/services/editor.service";

@Component({
  standalone: true,
  selector: "app-header",
  imports: [CommonModule, MatIconModule, MatSelectModule, MatToolbarModule, MatMenuModule, MatButtonModule],
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"]
})
export class HeaderComponent {
    @Input()
    editorState = EditorState.ready;

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
    stopClick = new EventEmitter<void>();

    @Output()
    aboutClick = new EventEmitter<void>();
}
