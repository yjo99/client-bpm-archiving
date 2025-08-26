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
    processId: string | undefined = '';

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        console.log('History state:', history.state);

        // Get process data from history state (works after navigation)
        if (history.state && history.state.processData) {
            this.process = history.state.processData;
            this.processId = this.process?.ID;
            console.log('Process set from history state:', this.process);
        }
        // Try to get from navigation state (works during navigation)
        else {
            const navigation = this.router.getCurrentNavigation();
            console.log('Navigation state:', navigation?.extras.state);

            if (navigation?.extras?.state?.["processData"]) {
                this.process = navigation.extras.state["processData"];
                this.processId = this.process?.ID;
                console.log('Process set from navigation state:', this.process);
            }
            // If still no data, show error and redirect back
            else {
                console.warn('No process data found in state');
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Process data not available. Please go back and try again.'
                });

                // Redirect back after a short delay
                setTimeout(() => {
                    this.router.navigate(['/pages/process']);
                }, 2000);
            }
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