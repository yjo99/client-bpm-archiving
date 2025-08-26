// pages/process/configure/process-configuration.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MessageService } from 'primeng/api';
import {ProcessModel} from "../../layout/model/process.model";

@Component({
    selector: 'app-process-configuration',
    templateUrl: './process-configuration.component.html',
    imports: [CommonModule, ButtonModule, CardModule],
    providers: [MessageService]
})
export class ProcessConfigurationComponent implements OnInit {
    process: ProcessModel | null = null;
    processId: string = '';

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        // Get process data from navigation state
        const navigation = this.router.getCurrentNavigation();
        const state = navigation?.extras.state as { processData: ProcessModel } | undefined;

        if (state?.processData) {
            this.process = state.processData;
            this.processId = this.process.ID; // Set processId from the process data
        } else {
            // If no state, redirect back to process management
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please select a process to configure'
            });
            this.router.navigate(['/processmanagement']);
        }
    }

    saveConfiguration(): void {
        // Implement save configuration logic
        this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Process configuration saved successfully'
        });

        // Navigate back to processes list
        setTimeout(() => {
            this.router.navigate(['/pages/process']);
        }, 1500);
    }

    cancel(): void {
        this.router.navigate(['/pages/process']);
    }
}