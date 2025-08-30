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
import { ProcessService, InstalledSnapshots, SnapshotDto } from "../../layout/service/ProcessService";

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
    selectedSnapshots: InstalledSnapshots[] = [];
    loading: boolean = false;
    configuring: boolean = false;

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
        // Get process ID and name from query parameters
        this.route.queryParams.subscribe(params => {
            console.log("get query params")
            console.log(params)
            this.processId = params['processId'];
            this.processName = params['processName'] || 'Process';

            if (this.processId) {
                this.loadSnapshots();
            } else {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Process ID is required'
                });
            }
        });
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

    getStatusSeverity(status: any): string {
        if (status === null || status === undefined) return 'info';

        // Handle boolean values
        if (typeof status === 'boolean') {
            return status ? 'success' : 'warning';
        }

        // Handle string values
        if (typeof status === 'string') {
            const lowerStatus = status.toLowerCase();
            if (lowerStatus === 'true' || lowerStatus === 'active') {
                return 'success';
            } else if (lowerStatus === 'false' || lowerStatus === 'inactive') {
                return 'warning';
            }
            return 'info';
        }

        // Handle numeric values
        if (typeof status === 'number') {
            return status === 1 ? 'success' : 'warning';
        }

        return 'info';
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

    // Prepare snapshot data for configuration
    prepareSnapshotConfiguration(): SnapshotDto[] {
        return this.selectedSnapshots.map(snapshot => ({
            snapshotID: snapshot.ID || '',
            branchID: snapshot.branchID || '',
            acronym: snapshot.acronym || '',
            isActive: snapshot.active || 'false',
            activeSince: '', // You might need to adjust this based on your data
            createdOn: snapshot.createdOn || '',
            ID: 0 // This might need to be populated if you have an ID field
        }));
    }

    // Configure selected snapshots
    configureSelectedSnapshots(): void {
        if (this.selectedSnapshots.length === 0) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please select at least one snapshot to configure'
            });
            return;
        }

        this.configuring = true;
        const snapshotConfigs = this.prepareSnapshotConfiguration();

        this.processService.snapshotConfiguration(snapshotConfigs).subscribe({
            next: (response: any) => {
                this.configuring = false;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Snapshots configured successfully'
                });
                this.selectedSnapshots = []; // Clear selection after success
            },
            error: (error: any) => {
                this.configuring = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to configure snapshots: ' + error.message
                });
                console.error('Error configuring snapshots:', error);
            }
        });
    }

    goBack(): void {
        this.router.navigate(['/pages/processmanagement']);
    }

    refreshSnapshots(): void {
        this.loadSnapshots();
        this.selectedSnapshots = []; // Clear selection on refresh
    }

    isSelected(snapshot: InstalledSnapshots): boolean {
        return this.selectedSnapshots.some(s => s.ID === snapshot.ID);
    }

    // pages/process/snapshots/process-snapshots.component.ts (add this method)
    viewInstances(snapshot: InstalledSnapshots): void {
        this.router.navigate(['/pages/process/instances'], {
            queryParams: {
                processName: this.processName,
                acronym: snapshot.acronym,
                snapshotID: snapshot.ID
            }
        });
    }
}