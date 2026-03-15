import { Component, Input, Output, EventEmitter, Optional, Self } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';

@Component({
    selector: 'emb-dropdown',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FormsModule, SelectModule],
    template: `
    <div class="tw-form-group">
      <div class="flex-between">
        <label class="tw-label-field">{{ caption }}</label>
        <i *ngIf="isInvalid" class="pi pi-info-circle p-error" [title]="caption + ' is required'"></i>
      </div>

      <p-select 
        [options]="options" 
        [optionLabel]="displayMember" 
        [optionValue]="valueMember"
        [placeholder]="placeholder"
        [filter]="filter"
        (onChange)="onSelectChange($event)"
        styleClass="tw-dropdown-custom"
        [disabled]="readonly"
        appendTo="body"
        [class.ng-invalid]="isInvalid"
        [class.ng-dirty]="isInvalid"
        [(ngModel)]="value">
      </p-select>
    </div>
  `,
    styles: [`
    :host ::ng-deep .tw-dropdown-custom.p-select {
      width: 100%;
      border-radius: 8px;
      border: 1px solid #e8e6df;
      background: #ffffff;
    }
    :host ::ng-deep .tw-dropdown-custom.p-select.ng-invalid.ng-dirty {
      border-color: #e24c4c !important;
    }
  `]
})
export class EmbDropdownComponent {
    @Input() caption: string = '';
    @Input() set label(v: string) { this.caption = v; }
    @Input() placeholder: string = 'Select...';
    @Input() options: any[] = [];
    @Input() readonly: boolean = false;
    @Input() valueMember: string = 'value';
    @Input() displayMember: string = 'name';
    @Input() filter: boolean = false;
    @Output() change = new EventEmitter<any>();

    value: any;
    constructor(@Optional() @Self() public controlDir: NgControl) {
        if (this.controlDir) { this.controlDir.valueAccessor = this; }
    }

    onSelectChange(event: any) {
        this.onChange(event.value);
        this.change.emit(event.value);
    }

    get isInvalid() {
        const control = this.controlDir?.control;
        return control ? control.invalid && (control.dirty || control.touched) : false;
    }

    writeValue(val: any): void { this.value = val; }
    registerOnChange(fn: any): void { this.onChange = fn; }
    registerOnTouched(fn: any): void { this.onTouched = fn; }
    private onChange = (val: any) => { };
    private onTouched = () => { };
}