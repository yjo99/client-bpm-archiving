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
        if (navigation?.extras.state) {
            this.process = navigation.extras.state['processData'];
        }

        // Get process ID from route parameters
        this.processId = this.route.snapshot.paramMap.get('id') || '';

        // If no process data in state, you might want to fetch it from API
        if (!this.process) {
            this.fetchProcessData();
        }
    }

    fetchProcessData(): void {
        // Implement API call to fetch process data by ID
        // this.processService.getProcessById(this.processId).subscribe(...)
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