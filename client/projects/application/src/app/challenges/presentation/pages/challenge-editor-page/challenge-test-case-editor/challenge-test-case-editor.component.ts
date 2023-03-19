import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorChallengeTestCase } from '../editor-challenge-test-case';
import { TownCamera } from 'projects/application/src/app/shared/presentation/town/town-camera';
import { Vector } from 'karel';
import { TownEditorComponent } from 'projects/application/src/app/shared/presentation/components/town-editor/town-editor.component';
import { MatChipsModule } from '@angular/material/chips';

@Component({
    selector: 'app-challenge-test-case-editor',
    standalone: true,
    imports: [CommonModule, TownEditorComponent, MatChipsModule],
    templateUrl: './challenge-test-case-editor.component.html',
    styleUrls: ['./challenge-test-case-editor.component.css']
})
export class ChallengeTestCaseEditorComponent {
    @Input()
    testCase: EditorChallengeTestCase | null = null;

    @Output()
    testCaseChange = new EventEmitter<EditorChallengeTestCase>();

    townCamera = new TownCamera(Vector.ZERO, 1);

    constructor() {
        console.log("new");
    }

    onTownCameraChange(townCamera: TownCamera) {
        this.townCamera = townCamera;
    }

    onCheckKarelPositionChange(newValue: boolean) {
        const newTestCase = { ...this.testCase!, checkKarelPosition: newValue };
        this.testCaseChange.emit(newTestCase);
    }

    onCheckKarelDirectionChange(newValue: boolean) {
        const newTestCase = { ...this.testCase!, checkKarelDirection: newValue };
        this.testCaseChange.emit(newTestCase);
    }

    onCheckSignsChange(newValue: boolean) {
        const newTestCase = { ...this.testCase!, checkSigns: newValue };
        this.testCaseChange.emit(newTestCase);
    }
}
