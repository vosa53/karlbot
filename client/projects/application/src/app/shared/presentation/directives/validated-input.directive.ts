import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { MatInput } from '@angular/material/input';

/**
 * Adds validation to an input. Can only be applied to {@link HTMLInputElement} with {@link MatInputDirective} directive.
 * 
 * It is useful because it does not emit any change events during editing, but only after the user finished the editing with a valid value.
 * Thanks to this property it allows to easily one-way bind values from models and to update them via events only with *valid* values.
 */
@Directive({
    standalone: true,
    selector: '[appValidatedInput]'
})
export class ValidatedInputDirective {
    /**
     * Valid value shown in the input.
     */
    @Input()
    get validatedValue(): string {
        return this._validatedValue;
    }

    set validatedValue(value: string) {
        this._validatedValue = value;

        if (document.activeElement !== this.inputElement)
            this.setInputValue(value);
    }

    /**
     * Validator validating the input value.
     */
    @Input()
    validator: ValidatedInputValidator = t => true;

    /**
     * Event when the user finished editing and inputted a valid value. This value is guaranteed to be valid according to the given validator.
     */
    @Output()
    validatedValueChange = new EventEmitter<string>();

    private readonly inputElement: HTMLInputElement;
    private _validatedValue = "";

    constructor(private readonly matInput: MatInput, inputElementRef: ElementRef) {
        if (!(inputElementRef.nativeElement instanceof HTMLInputElement))
            throw new Error("appValidatedInput can not be applied to elements other than input.");

        this.inputElement = inputElementRef.nativeElement;
        this.setInputValue("");
    }

    @HostListener("input")
    onInput() {
        this.updateErrorState();
    }

    @HostListener("blur")
    onBlur() {
        this.commitChange();
    }

    @HostListener("keypress", ["$event"])
    onKeyPress(event: KeyboardEvent) {
        if (event.key === "Enter") {
            event.preventDefault();
            this.commitChange();
        }
    }

    private commitChange() {
        const value = this.inputElement.value;
        this.inputElement.blur();
        this.setInputValue(this.validatedValue);

        if (this.validator(value))
            this.validatedValueChange.emit(value);
    }

    private setInputValue(value: string) {
        this.inputElement.value = value;
        this.updateErrorState();
    }

    private updateErrorState() {
        this.matInput.errorState = !this.validator(this.inputElement.value);
    }
}

/**
 * Text validator for {@link ValidatedInputDirective}.
 */
export type ValidatedInputValidator = (text: string) => boolean;

/**
 * {@link ValidatedInputValidator} factory.
 */
export class ValidatedInputValidatorFactory {
    /**
     * Creates a validator validating that the text is an integer.
     * @param integerValidator Validator further validating the parsed integer.
     */
    static integer(integerValidator?: (number: number) => boolean): ValidatedInputValidator {
        return (text: string) => {
            const integerRegex = /^(0|-?[1-9][0-9]*)$/;
            if (!integerRegex.test(text))
                return false;

            if (integerValidator !== undefined)
                return integerValidator(parseInt(text, 10));
            else
                return true;
        };
    }
}