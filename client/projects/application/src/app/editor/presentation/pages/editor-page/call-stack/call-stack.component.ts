import { CommonModule } from "@angular/common";
import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { PanelComponent } from "../../../components/panel/panel.component";
import { ReadonlyCallStackFrame } from "karel";

@Component({
    selector: 'app-call-stack',
    standalone: true,
    imports: [CommonModule, MatIconModule, MatListModule, PanelComponent],
    templateUrl: './call-stack.component.html',
    styleUrls: ['./call-stack.component.css']
})
export class CallStackComponent implements OnChanges {
    @Input()
    callStack: readonly ReadonlyCallStackFrame[] = [];

    callStackSorted: readonly ReadonlyCallStackFrame[] = [];

    ngOnChanges(changes: SimpleChanges): void {
        if ("callStack" in changes)
            this.callStackSorted = [...this.callStack].reverse();
    }
}

