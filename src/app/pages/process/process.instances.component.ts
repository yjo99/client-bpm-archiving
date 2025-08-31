// pages/process/instances/process-instances.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { PaginatorModule } from 'primeng/paginator';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import {Instances, ProcessSnapshotDTO} from "../../layout/model/instances.model";
import {InstancesService} from "../../layout/service/instances.service";

@Component({
    selector: 'app-process-instances',
    templateUrl: './process-instances.component.html',
    imports: [
        CommonModule,
        ButtonModule,
        CardModule,
        TableModule,
        TagModule,
        ProgressSpinnerModule,
        PaginatorModule,
        ToastModule
    ],
    providers: [MessageService]
})
export class ProcessInstancesComponent implements OnInit {
    processId: string= '';
    processName: string = '';
    processAcronym: string = '';
    snapshotID: string = '';
    instances: Instances = {
    overview: {
        Active: 0,
        Total: 0,
        Completed: 0,
        Failed: 0,
        Terminated: 0,
        Did_not_Start: 0,
        Suspended: 0
    },
    processes: []
};
    loading: boolean = false;

    // Pagination
    pageNumber: number = 0;
    pageSize: number = 10;
    totalRecords: number = 0;

    // Table columns
    cols = [
        { field: 'piid', header: 'Instance ID' },
        { field: 'name', header: 'Name' },
        { field: 'bpdName', header: 'BPD Name' },
        { field: 'executionState', header: 'Status' },
        { field: 'lastModificationTime', header: 'Last Modified' }
    ];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private messageService: MessageService,
        private instancesService: InstancesService,
        private location: Location
    ) {}

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            this.processName = params['processName'] || 'Process';
            this.processAcronym = params['acronym'] || '';
            this.snapshotID = params['snapshotID'] || '';
            this.processId = params['processID'] || '';

            if (this.processAcronym && this.snapshotID) {
                this.loadInstances();
            } else {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Missing snapshot information'
                });
            }
        });
    }

    loadInstances(): void {
        this.loading = true;

        const processSnapshotDTO: ProcessSnapshotDTO = {
            name: this.processAcronym,
            snapshotID: this.snapshotID,
            pageNumber: this.pageNumber,
            pageSize: this.pageSize
        };

        this.instancesService.getAllInstancesBySnapshotID(processSnapshotDTO).subscribe({
            next: (data: Instances) => {
                this.instances = data;
                this.totalRecords = data.overview?.Total || 0;
                this.loading = false;
            },
            error: (error: any) => {
                console.error('Error loading instances:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load instances'
                });
                this.loading = false;
            }
        });
    }

    onPageChange(event: any): void {
        this.pageNumber = event.page;
        this.pageSize = event.rows;
        this.loadInstances();
    }

    getStatusSeverity(status: string): string {
        if (!status) return 'info';

        const lowerStatus = status.toLowerCase();
        switch (lowerStatus) {
            case 'active':
            case 'running':
            case 'completed':
                return 'success';
            case 'failed':
            case 'terminated':
                return 'danger';
            case 'suspended':
                return 'warning';
            case 'did_not_start':
                return 'info';
            default:
                return 'info';
        }
    }

    formatDate(dateString: string): string {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleString();
        } catch (error) {
            return 'Invalid Date';
        }
    }

    goBack(): void {
        if (window.history.length > 1) {
            this.location.back();
        } else {
            // Fallback to default navigation if no history
            this.router.navigate(['/pages/processmanagement']);
        }
    }

    refreshInstances(): void {
        this.loadInstances();
    }

    viewDynamic(ppid: string, event: Event) {
        event.stopPropagation();
        this.router.navigate(['pages/process/view'], {
            queryParams: {
                processID: this.processId,
                snapshotID: this.snapshotID,
                ppid: ppid
            }
        });
    }


        // this.router.navigate(['/pages/process/instances'], {
        //     queryParams: {
        //         processName: this.processName,
        //         acronym: this.processAcronym,
        //         snapshotID: snapshot.ID,
        //         processID: this.processId
        //     }
        // });
}