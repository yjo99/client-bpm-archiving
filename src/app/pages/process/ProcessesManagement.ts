// processes-management.component.ts
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ProcessService } from "../../layout/service/ProcessService";
import { ProcessModel } from "../../layout/model/process.model";
import { DataView } from "primeng/dataview";
import { AppFloatingConfigurator } from "../../layout/component/app.floatingconfigurator";
import { SelectButton } from "primeng/selectbutton";
import { FormsModule } from "@angular/forms";
import {CommonModule, DatePipe, NgClass, NgForOf} from "@angular/common";
import { TableModule } from "primeng/table";
import { ProcessStatus } from "../../layout/model/ProcessStatus";
import { Router } from "@angular/router";
import { LazyLoadEvent } from 'primeng/api';
import { PaginatorModule } from 'primeng/paginator';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import {ProcessResponse} from "../../core/DTO/process.response";

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
        NgForOf,
        DatePipe,
        PaginatorModule,
        ProgressSpinnerModule
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
                // Add explicit type annotation to the process parameter
                this.processes = response.processAppsList.map((process: ProcessModel) => ({
                    ...process,
                    createdDate: new Date(process.lastModified_on) // Map lastModified_on to createdDate
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

                // Fallback to mock data for development
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

    // Handle lazy loading for DataView (if needed)
    loadProcessesLazy(event: LazyLoadEvent): void {
        this.page = (event.first || 0) / (event.rows || 10);
        this.pageSize = event.rows || 10;
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
}