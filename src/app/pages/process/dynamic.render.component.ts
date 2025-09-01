import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';

// PrimeNG imports
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { FileUploadModule } from 'primeng/fileupload';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CardModule } from 'primeng/card';
import {InputTextModule} from "primeng/inputtext";

@Component({
    selector: 'app-dynamic-renderer',
    templateUrl: './dynamic-renderer.component.html',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
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

    constructor(private messageService: MessageService) {}

    hasChildren(): boolean {
        return this.node.children && this.node.children.length > 0;
    }

    isSupported(): boolean {
        try {
            const supportedTypes = [
                'Collapsible Panel', 'Panel', 'Section',
                'Input Group', 'Text', 'Output Text', 'Label',
                'Button', 'Dropdown', 'Select', 'CheckBox', 'Radio',
                'Table', 'Data Grid', 'Date', 'DateTime Picker',
                'File Upload', 'Link', 'Image', 'Spacer', 'Separator'
            ];

            return !this.node.controlType || supportedTypes.includes(this.node.controlType);
        } catch (error) {
            console.error('Error checking if control is supported', error);
            return false;
        }
    }

    getOptions(): any[] {
        try {
            return this.node.options || [];
        } catch (error) {
            console.error('Error getting options', error);
            return [];
        }
    }

    onButtonClick(node: any) {
        try {
            console.log("Button clicked:", node.label);
            // Emit the button click event to the parent component
            this.buttonClick.emit(node);
        } catch (error) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to process button click'
            });
        }
    }

    // Safe value accessor - simplified to handle direct binding names
    getValue(binding: string): any {
        try {
            if (!binding || !this.form) return '';

            // If binding is a simple key like "we", "qqq", "dasd"
            if (this.form.hasOwnProperty(binding)) {
                return this.form[binding];
            }

            // For complex bindings like "tw.local.App.name"
            const parts = binding.split('.');
            let value = this.form;

            for (const part of parts) {
                if (value[part] === undefined) return '';
                value = value[part];
            }

            return value;
        } catch (error) {
            console.error('Error accessing form value', error);
            return '';
        }
    }

    // Check if this should be a read-only field
    isReadOnly(controlType: string): boolean {
        // Make Output Text and unsupported controls read-only
        return controlType === 'Output Text' || !this.isSupported();
    }

    handleInput(event: Event, binding: string): void {
        const target = event.target as HTMLInputElement;
        if (target) {
            this.setValue(binding, target.value);
        }
    }

    // Safe value setter
    setValue(binding: string, value: any): void {
        try {
            if (!binding || !this.form) return;

            // For simple bindings
            if (this.form.hasOwnProperty(binding)) {
                this.form[binding] = value;
                return;
            }

            // For complex bindings
            const parts = binding.split('.');
            let obj = this.form;

            // Navigate to the parent object
            for (let i = 0; i < parts.length - 1; i++) {
                const part = parts[i];
                if (obj[part] === undefined) obj[part] = {};
                obj = obj[part];
            }

            // Set the value
            const lastPart = parts[parts.length - 1];
            obj[lastPart] = value;

            console.log('Form updated:', this.form);
        } catch (error) {
            console.error('Error setting form value', error);
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to update form value'
            });
        }
    }
}