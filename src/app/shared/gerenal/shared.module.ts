import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// Import all your custom "Studio" components
import { ErpGridComponent } from '@shared/components/ag-grid/ag-grid.component';
import { EmbTextboxComponent } from '@shared/components/textbox/textbox.component';
import { EmbDropdownComponent } from '@shared/components/dropdown/dropdown.component';
import { EmbTabsComponent } from '@shared/components/tab/tabs.component';
import { EmbTabsetComponent } from '@shared/components/tab/tabset.component';
import { EmbPanelComponent } from '@shared/components/panel/panel.component';

// PrimeNG Modules that are used frequently
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { ModalComponent } from '@shared/components/modal/modal.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        // Import Standalone Components here
        EmbTextboxComponent,
        EmbDropdownComponent,
        EmbTabsComponent,
        EmbTabsetComponent,
        EmbPanelComponent,
        ModalComponent,
        ErpGridComponent,
        TooltipModule,
        ButtonModule
    ],
    exports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        // Export them so they are available to any module that imports SharedModule
        EmbTextboxComponent,
        EmbDropdownComponent,
        EmbTabsComponent,
        EmbTabsetComponent,
        EmbPanelComponent,
        ModalComponent,
        ErpGridComponent,
        TooltipModule,
        ButtonModule
    ]
})
export class SharedModule { }