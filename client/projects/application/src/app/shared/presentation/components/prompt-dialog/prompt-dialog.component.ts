import { CommonModule } from "@angular/common";
import { Component, Inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { ValidatedInputDirective } from "../../directives/validated-input.directive";
import { AbstractControl, FormControl, ReactiveFormsModule, ValidationErrors, ValidatorFn } from "@angular/forms";

@Component({
    standalone: true,
    selector: "app-prompt-dialog",
    imports: [CommonModule, MatDialogModule, ValidatedInputDirective, MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule],
    templateUrl: "./prompt-dialog.component.html",
    styleUrls: ["./prompt-dialog.component.css"]
})
export class PromptDialogComponent {
    readonly text: FormControl;

    constructor(readonly dialogRef: MatDialogRef<PromptDialogComponent>, @Inject(MAT_DIALOG_DATA) readonly data: PromptDialogData) {
        this.text = new FormControl(data.text, {
            validators: this.createFormControlValidator(data.validator), 
            updateOn: "change"
        });
    }

    onCloseClick() {
        this.dialogRef.close(this.text.value);
    }

    private createFormControlValidator(validator: PromptDialogValidator): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            return validator(control.value) ? null : { validationError: { value: control.value } };
        };
    }
}

export interface PromptDialogData {
    readonly title: string;
    readonly message: string;
    readonly text: string;
    readonly validator: PromptDialogValidator;
}

export type PromptDialogValidator = (text: string) => boolean;