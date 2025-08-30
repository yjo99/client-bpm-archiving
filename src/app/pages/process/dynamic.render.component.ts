import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MessageService} from "primeng/api";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {ButtonModule} from "primeng/button";
import {InputTextModule} from "primeng/inputtext";
import {PanelModule} from "primeng/panel";
import {DropdownModule} from "primeng/dropdown";
import {CheckboxModule} from "primeng/checkbox";
import {TableModule} from "primeng/table";
import {CalendarModule} from "primeng/calendar";
import {FileUploadModule} from "primeng/fileupload";
import {RadioButtonModule} from "primeng/radiobutton";
import {CardModule} from "primeng/card";

@Component({
    selector: 'app-dynamic-renderer',
    templateUrl: './dynamic-renderer.component.html',
    imports: [
        CommonModule,
        FormsModule,

        // PrimeNG
        ButtonModule,
        PanelModule,
        InputTextModule,
        DropdownModule,
        CheckboxModule,
        RadioButtonModule,
        TableModule,
        CalendarModule,
        FileUploadModule,
        CardModule
    ]

})
export class DynamicRendererComponent {
    @Input() node: any;
    @Input() form: any = {};
    @Output() buttonClick = new EventEmitter<any>();
    values: Record<string, any> = {};  // store form values dynamically


    constructor(private messageService: MessageService) {}

    isSupported(node: any): boolean {
        try {
            return [
                'Collapsible Panel','Panel','Section',
                'Input Group','Text','Output Text','Label',
                'Button','Dropdown','Select','CheckBox','Radio',
                'Table','Data Grid','Date','DateTime Picker',
                'File Upload','Link','Image','Spacer','Separator'
            ].includes(node.controlType || '');
        } catch (error) {
            console.error('Error checking if control is supported', error);
            return false;
        }
    }

    getOptions(node: any): any[] {
        try {
            // Example: fetch options dynamically if provided in node
            return node.options || [];
        } catch (error) {
            console.error('Error getting options', error);
            return [];
        }
    }

    onButtonClick(node: any) {
        try {
            console.log("Button clicked:", node.label, "form state:", this.form);
            this.buttonClick.emit(node);
        } catch (error) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to process button click'
            });
        }
    }

    // Safe value accessor to prevent errors
    getValue(binding: string): any {
        try {
            if (!binding || !this.form) return '';

            // Convert binding string to object reference
            const parts = binding.split('.');
            let value = this.form;

            for (const part of parts) {
                if (part === 'tw') continue; // Skip the 'tw' prefix
                if (value[part] === undefined) return '';
                value = value[part];
            }

            return value;
        } catch (error) {
            console.error('Error accessing form value', error);
            return '';
        }
    }

    // Safe value setter to prevent errors
// Safe value setter to prevent errors
    setValue(binding: string, value: any): void {
        try {
            if (!binding) return;

            // Update local values store
            this.values[binding] = value;

            // Also update the form object if it exists
            if (!this.form) return;

            // Convert binding string to object reference (e.g., "process.details.name")
            const parts = binding.split('.');
            let obj: any = this.form;

            // Navigate to the parent object
            for (let i = 0; i < parts.length - 1; i++) {
                const part = parts[i];
                if (obj[part] === undefined || obj[part] === null) {
                    obj[part] = {}; // create missing path
                }
                obj = obj[part];
            }

            // Set the value at the last part
            const lastPart = parts[parts.length - 1];
            obj[lastPart] = value;
        } catch (error) {
            console.error('Error setting form value', error);
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to update form value'
            });
        }
    }


    handleImageError(event: Event) {
        const target = event.target as HTMLImageElement;
        // Fallback image path or a placeholder
        // target.src = 'assets/images/placeholder.png';
    }
}