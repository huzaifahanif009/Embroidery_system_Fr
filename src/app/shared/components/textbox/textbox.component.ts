import { Component, Input, Optional, Self } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgControl, ReactiveFormsModule, ControlValueAccessor } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';

@Component({
    selector: 'emb-textbox',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, InputTextModule],
    template: `
    <div class="tw-form-group">
      <div class="flex-between">
        <label class="tw-label-field">{{ caption }} <span *ngIf="required">*</span></label>
        
        <span class="validation-error" *ngIf="isInvalid">
          <i class="pi pi-info-circle p-error" [title]="errorMessage"></i>
        </span>
      </div>

      <input 
        pInputText 
        [type]="type" 
        [placeholder]="placeholder" 
        [maxLength]="maxlength"
        [readOnly]="readonly"
        [min]="min"
        [max]="max"
        [step]="step"
        class="tw-input"
        [class.input-color]="type === 'color'"
        [class.ng-invalid]="isInvalid"
        [class.ng-dirty]="isInvalid"
        (input)="onInput($event)"
        (blur)="onBlur()"
        [value]="value" />
    </div>
  `,
    styles: [`
    .flex-between { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
    .p-error { color: #e24c4c; cursor: help; font-size: 14px; }
    
    /* Studio Invalid Border */
    .tw-input.ng-invalid.ng-dirty { border-color: #e24c4c !important; }

    /* Special styling for color picker type */
    .input-color {
      height: 40px;
      padding: 2px 4px !important;
      cursor: pointer;
    }

    /* Date/Number specific tweaks */
    input[type="date"]::-webkit-calendar-picker-indicator {
      cursor: pointer;
      filter: invert(20%) sepia(10%) saturate(1000%) hue-rotate(100deg); /* Studio Green tint */
    }
  `]
})
export class EmbTextboxComponent implements ControlValueAccessor {
    @Input() caption: string = '';
    @Input() set label(v: string) { this.caption = v; }
    @Input() placeholder: string = '';

    // Dynamic Types: 'text' | 'number' | 'date' | 'email' | 'color' | 'password'
    @Input() type: string = 'text';

    @Input() maxlength: number = 250;
    @Input() required: boolean = false;
    @Input() readonly: boolean = false;

    // Numeric/Date constraints
    @Input() min?: number | string;
    @Input() max?: number | string;
    @Input() step?: number | string;

    value: any = '';

    constructor(@Optional() @Self() public controlDir: NgControl) {
        if (this.controlDir) { this.controlDir.valueAccessor = this; }
    }

    get isInvalid() {
        const control = this.controlDir?.control;
        return control ? control.invalid && (control.dirty || control.touched) : false;
    }

    get errorMessage() {
        if (this.controlDir?.errors?.['email']) return 'Invalid email format';
        if (this.controlDir?.errors?.['required']) return `${this.caption} is required`;
        return `${this.caption} is invalid`;
    }

    // ControlValueAccessor Implementation
    writeValue(val: any): void {
        this.value = val === undefined ? '' : val;
    }

    registerOnChange(fn: any): void { this.onChange = fn; }
    registerOnTouched(fn: any): void { this.onTouched = fn; }

    private onChange = (val: any) => { };
    private onTouched = () => { };

    onInput(e: any) {
        let val = e.target.value;

        // Ensure numeric type returns a number, not a string
        if (this.type === 'number' && val !== '') {
            val = Number(val);
        }

        this.value = val;
        this.onChange(val);
    }

    onBlur() {
        this.onTouched();
    }
}