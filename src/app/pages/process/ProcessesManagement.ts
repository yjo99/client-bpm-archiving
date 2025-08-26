// processes-management.component.ts
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ProcessService } from "../../layout/service/ProcessService";
import { ProcessModel } from "../../layout/model/process.model";
import { DataView } from "primeng/dataview";
import { AppFloatingConfigurator } from "../../layout/component/app.floatingconfigurator";
import { SelectButton } from "primeng/selectbutton";
import { FormsModule } from "@angular/forms";
import { CommonModule, DatePipe, NgClass } from "@angular/common";
import { TableModule } from "primeng/table";
import { ProcessStatus } from "../../layout/model/ProcessStatus";
import { Router } from "@angular/router";
import { PaginatorModule } from 'primeng/paginator';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ProcessResponse } from "../../core/DTO/process.response";
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-processes',
    templateUrl: './process-managment.html',
    imports: [
        DataView,
        CommonModule,
        AppFloatingConfigurator,
        SelectButton,
        FormsModule,
        NgClass,
        TableModule,
        DatePipe,
        PaginatorModule,
        ProgressSpinnerModule,
        TagModule, // Add TagModule
        ButtonModule // Add ButtonModule
    ],
    providers: [MessageService]
})
export class ProcessesManagement implements OnInit {
    processes: ProcessModel[] = [];
    layout: 'list' | 'grid' = 'list';
    options = ['list', 'grid'];

    // Pagination properties
    totalRecords: number = 0;
    page: number = 0;
    pageSize: number = 10;
    loading: boolean = false;

    constructor(
        private processService: ProcessService,
        private messageService: MessageService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.loadProcesses();
    }

    loadProcesses(): void {
        this.loading = true;
        this.processService.getProcesses(this.page, this.pageSize).subscribe({
            next: (response: ProcessResponse) => {
                this.processes = response.processAppsList.map((process: ProcessModel) => ({
                    ...process,
                    createdDate: new Date(process.lastModified_on)
                }));
                this.totalRecords = response.totalCount || response.processAppsList.length;
                this.loading = false;
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load processes'
                });
                this.loading = false;
                this.processes = this.processService.getMockProcesses();
                this.totalRecords = this.processes.length;
            }
        });
    }

    onPageChange(event: any): void {
        this.page = event.page;
        this.pageSize = event.rows;
        this.loadProcesses();
    }

    getInstanceSeverity(status: ProcessStatus): string {
        switch (status.toLowerCase()) {
            case ProcessStatus.Completed: return 'success';
            default: return 'info';
        }
    }

    viewInstances(processId: string, processName: string): void {
        this.router.navigate(['/pages/process/instance', processId, 'instances'], {
            queryParams: { name: processName },
        });
    }

    // New method to navigate to configuration screen
    configureProcess(process: ProcessModel): void {
        this.router.navigate(['/pages/process/configure', process.ID], {
            state: { processData: process } // Pass process data to configuration screen
        });
    }

    // Method to get severity for configuration status tag
    getConfigurationSeverity(configured: boolean): string {
        return configured ? 'success' : 'warning';
    }

    // Method to get configuration status text
    getConfigurationText(configured: boolean): string {
        return configured ? 'Configured' : 'Not Configured';
    }
}