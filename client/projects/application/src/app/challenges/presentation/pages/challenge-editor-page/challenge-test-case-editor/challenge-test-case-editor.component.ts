import { Component, Input, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";
import { EditorChallengeTestCase } from "../editor-challenge-test-case";
import { TownCamera } from "projects/application/src/app/shared/presentation/town/town-camera";
import { TownEditorComponent } from "projects/application/src/app/shared/presentation/components/town-editor/town-editor.component";
import { MatChipsModule } from "@angular/material/chips";
import { MutableTown, Vector } from "karel";

/**
 * Edited challenge test case.
 */
@Component({
    selector: "app-challenge-test-case-editor",
    standalone: true,
    imports: [CommonModule, TownEditorComponent, MatChipsModule],
    templateUrl: "./challenge-test-case-editor.component.html",
    styleUrls: ["./challenge-test-case-editor.component.css"]
})
export class ChallengeTestCaseEditorComponent {
    /**
     * Challenge test case.
     */
    @Input()
    get testCase(): EditorChallengeTestCase | null {
        return this._testCase;
    }

    set testCase(value: EditorChallengeTestCase | null) {
        if (this._testCase !== null) {
            this._testCase.inputTown.changed.removeListener(this.inputTownChangedHandler);
            this._testCase.outputTown.changed.removeListener(this.outputTownChangedHandler);
        }
        this._testCase = value;
        if (this._testCase !== null) {
            this._testCase.inputTown.changed.addListener(this.inputTownChangedHandler);
            this._testCase.outputTown.changed.addListener(this.outputTownChangedHandler);
            this.townCamera = new TownCamera(new Vector(this._testCase.inputTown.width / 2, this._testCase.inputTown.height / 2), 1);
        }
    }

    /**
     * Called when the camera is moved.
     */
    @Output()
    testCaseChange = new EventEmitter<EditorChallengeTestCase>();

    /**
     * Town camera.
     */
    townCamera = new TownCamera(Vector.ZERO, 1);

    private _testCase: EditorChallengeTestCase | null = null;

    private isSynchronizingTowns = false;
    private readonly inputTownChangedHandler = () => this.synchronizeTowns(this.testCase!.inputTown, this.testCase!.outputTown);
    private readonly outputTownChangedHandler = () => this.synchronizeTowns(this.testCase!.outputTown, this.testCase!.inputTown);

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

    private synchronizeTowns(from: MutableTown, to: MutableTown) {
        if (this.isSynchronizingTowns)
            return;
        this.isSynchronizingTowns = true;

        to.resize(from.width, from.height);
        
        for (let y = 0; y < to.height; y++) {
            for (let x = 0; x < to.width; x++) {
                if (!this.testCase!.checkSigns)
                    to.setSignCountAt(x, y, from.getSignCountAt(x, y));
                to.setTileAt(x, y, from.getTileAt(x, y));
            }
        }
        if (!this.testCase!.checkKarelPosition)
            to.karelPosition = from.karelPosition;
        if (!this.testCase!.checkKarelDirection)
            to.karelDirection = from.karelDirection;
        to.homePosition = from.homePosition;

        this.isSynchronizingTowns = false;
    }
}
