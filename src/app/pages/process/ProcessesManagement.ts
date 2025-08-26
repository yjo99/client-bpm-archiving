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
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';

interface FilterOption {
  label: string;
  value: string;
  icon: string;
}

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
        TagModule,
        ButtonModule,
        DropdownModule,
        InputTextModule
    ],
    providers: [MessageService]
})
export class ProcessesManagement implements OnInit {
    processes: ProcessModel[] = [];
    filteredProcesses: ProcessModel[] = [];
    layout: 'list' | 'grid' = 'list';
    options = ['list', 'grid'];

    // Filter properties
    filterOptions: FilterOption[] = [
        { label: 'All Processes', value: 'all', icon: 'pi pi-list' },
        { label: 'Configured', value: 'configured', icon: 'pi pi-check-circle' },
        { label: 'Not Configured', value: 'not-configured', icon: 'pi pi-exclamation-circle' }
    ];
    selectedFilter: string = 'all';
    searchText: string = '';

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
                this.applyFilters(); // Apply filters after loading data
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
                this.applyFilters(); // Apply filters to mock data
            }
        });
    }

    // Apply filters based on selected filter and search text
    applyFilters(): void {
        let filtered = [...this.processes]; // Create a copy of the original array

        // Apply configuration filter
        if (this.selectedFilter === 'configured') {
            filtered = filtered.filter(process => process.configured);
        } else if (this.selectedFilter === 'not-configured') {
            filtered = filtered.filter(process => !process.configured);
        }

        // Apply search filter - ONLY by process name
        if (this.searchText && this.searchText.trim() !== '') {
            const searchLower = this.searchText.toLowerCase().trim();
            filtered = filtered.filter(process =>
                process.name && process.name.toLowerCase().includes(searchLower)
            );
        }

        this.filteredProcesses = filtered;
    }

    onFilterChange(): void {
        this.applyFilters();
    }

    onSearchChange(): void {
        // Use timeout to avoid excessive filtering on every keystroke
        setTimeout(() => {
            this.applyFilters();
        }, 300);
    }

    clearSearch(): void {
        this.searchText = '';
        this.applyFilters();
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

    configureProcess(process: ProcessModel): void {
        this.router.navigate(['/pages/process/configure', process.ID], {
            state: { processData: process }
        });
    }

    getConfigurationSeverity(configured: boolean): string {
        return configured ? 'success' : 'warning';
    }

    getConfigurationText(configured: boolean): string {
        return configured ? 'Configured' : 'Not Configured';
    }

    // Helper method to get filter icon
    getFilterIcon(value: string): string {
        const option = this.filterOptions.find(opt => opt.value === value);
        return option ? option.icon : 'pi pi-list';
    }

    // Helper method to get filter label
    getFilterLabel(value: string): string {
        const option = this.filterOptions.find(opt => opt.value === value);
        return option ? option.label : 'All Processes';
    }

    // Get count for each filter option
    getFilterCount(filterValue: string): number {
        switch (filterValue) {
            case 'all':
                return this.processes.length;
            case 'configured':
                return this.processes.filter(p => p.configured).length;
            case 'not-configured':
                return this.processes.filter(p => !p.configured).length;
            default:
                return 0;
        }
    }
}