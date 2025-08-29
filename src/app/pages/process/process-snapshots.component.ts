// pages/process/snapshots/process-snapshots.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import {ProcessService, InstalledSnapshots} from "../../layout/service/ProcessService";

@Component({
    selector: 'app-process-snapshots',
    templateUrl: './process-snapshots.component.html',
    imports: [
        CommonModule,
        ButtonModule,
        CardModule,
        TableModule,
        TagModule,
        ProgressSpinnerModule,
        ToastModule
    ],
    providers: [MessageService]
})
export class ProcessSnapshotsComponent implements OnInit {
    processId: string = '';
    processName: string = '';
    snapshots: InstalledSnapshots[] = [];
    loading: boolean = false;

    // Table columns
    cols = [
        { field: 'name', header: 'Name' },
        { field: 'acronym', header: 'Acronym' },
        { field: 'active', header: 'Status' },
        { field: 'createdOn', header: 'Created On' },
        { field: 'snapshotTip', header: 'Snapshot Tip' },
        { field: 'branchName', header: 'Branch' }
    ];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private messageService: MessageService,
        private processService: ProcessService
    ) {}

    ngOnInit(): void {
        // Get process ID and name from route parameters
        this.route.params.subscribe(params => {
            this.processId = params['id'];
            this.processName = params['name'] || 'Process';
            this.loadSnapshots();
        });

        // Alternatively, get from state if navigating from process list
        const navigation = this.router.getCurrentNavigation();
        if (navigation?.extras?.state) {
            this.processId = navigation.extras.state['processId'] || this.processId;
            this.processName = navigation.extras.state['processName'] || this.processName;
        }
    }

    loadSnapshots(): void {
        if (!this.processId) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Process ID is required'
            });
            return;
        }

        this.loading = true;
        this.processService.getInstalledSnapshots(this.processId).subscribe({
            next: (snapshots: any) => {
                this.snapshots = snapshots;
                this.loading = false;
            },
            error: (error: any) => {
                console.error('Error loading snapshots:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load snapshots'
                });
                this.loading = false;
            }
        });
    }

    getStatusSeverity(status: string): string {
        if (!status) return 'info';

        switch (status.toLowerCase()) {
            case 'active':
                return 'success';
            case 'inactive':
                return 'warning';
            default:
                return 'info';
        }
    }

    getStatusText(status: any): string {
        if (status === null || status === undefined) return 'Unknown';

        // Handle boolean values
        if (typeof status === 'boolean') {
            return status ? 'Active' : 'Not Active';
        }

        // Handle string values
        if (typeof status === 'string') {
            const lowerStatus = status.toLowerCase();
            if (lowerStatus === 'true' || lowerStatus === 'active') {
                return 'Active';
            } else if (lowerStatus === 'false' || lowerStatus === 'inactive') {
                return 'Not Active';
            }
            // For other string values, capitalize first letter
            return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
        }

        // Handle numeric values (1 = active, 0 = inactive)
        if (typeof status === 'number') {
            return status === 1 ? 'Active' : 'Not Active';
        }

        return 'Unknown';
    }

    formatDate(dateString: string): string {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString();
        } catch (error) {
            return 'Invalid Date';
        }
    }

    getActiveSnapshotCount(): number {
        if (!this.snapshots || this.snapshots.length === 0) return 0;
        return this.snapshots.filter(s => s.active && s.active.toLowerCase() === 'active').length;
    }

    getSnapshotTipCount(): number {
        if (!this.snapshots || this.snapshots.length === 0) return 0;
        return this.snapshots.filter(s => s.snapshotTip).length;
    }

    goBack(): void {
        this.router.navigate(['/pages/processmanagement']);
    }

    refreshSnapshots(): void {
        this.loadSnapshots();
    }
}