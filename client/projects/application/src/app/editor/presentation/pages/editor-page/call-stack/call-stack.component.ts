import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { PanelComponent } from "../../../components/panel/panel.component";
import { ReadonlyCallStackFrame } from 'dist/karel/lib/interpreter/readonly-call-stack-frame';

@Component({
    selector: 'app-call-stack',
    standalone: true,
    imports: [CommonModule, MatIconModule, MatListModule, PanelComponent],
    templateUrl: './call-stack.component.html',
    styleUrls: ['./call-stack.component.css']
})
export class CallStackComponent {
    @Input()
    callStack: readonly ReadonlyCallStackFrame[] = [];
}

