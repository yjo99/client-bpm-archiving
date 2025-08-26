import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router'; // Import ActivatedRoute
import {ProcessService} from '../../layout/service/ProcessService';
import {InstanceModel} from '../../layout/model/instance.model';
import {ProcessStatus} from '../../layout/model/ProcessStatus';
import {Table, TableModule} from "primeng/table";
import {Tag} from "primeng/tag";
import {DatePipe} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {Select} from "primeng/select";
import {IconField, IconFieldModule} from "primeng/iconfield";
import {InputText, InputTextModule} from "primeng/inputtext";
import {ButtonDirective} from "primeng/button";
import {InputGroupModule} from "primeng/inputgroup";
import {InputIcon} from "primeng/inputicon";

@Component({
    selector: 'app-instance-list-management',
    templateUrl: './instance-list.html',
    imports: [
        TableModule,
        Tag,
        DatePipe,
        FormsModule,
        Select,
        InputTextModule, // Add InputTextModule
        IconFieldModule, // Add IconFieldModule
        ButtonDirective,
        InputGroupModule,
        InputIcon
    ]
})
export class InstanceListManagement implements OnInit {
    instances: InstanceModel[] = [];
    processId!: number; // To store the processId
    processName!: string; // To store the processName
    loading: boolean = false;
    statusOptions: any[] = [
        {label: 'Running', value: 'Running'},
        {label: 'Completed', value: 'Completed'},
        {label: 'Failed', value: 'Failed'},
    ];

    constructor(
        private processService: ProcessService,
        private route: ActivatedRoute, // Inject ActivatedRoute
        private router: Router
    ) {
    }

    ngOnInit(): void {
        // Get the processId from the route parameters
        this.route.params.subscribe((params) => {
            this.processId = +params['processId']; // Convert to number
            // this.loadInstances(this.processId);
        });

        // Get the processName from the query parameters
        this.route.queryParams.subscribe((queryParams) => {
            this.processName = queryParams['name']; // Get processName
        });
    }

    loadInstances(processId: number): void {
        // this.instances = this.processService.getInstancesByProcessId(processId);
    }

    onGlobalFilter(table: Table, event: Event): void {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    clear(table: Table): void {
        table.clear();
    }

    getSeverity(status: ProcessStatus): "success" | "info" | "warn" | "danger" | "secondary" | "contrast" {
        switch (status.toLowerCase()) {
            case ProcessStatus.Completed:
                return 'success';
            case ProcessStatus.Running:
                return 'info';
            case ProcessStatus.Failed:
                return 'danger';
            default:
                return 'secondary'; // Default severity for unknown status
        }

    }

    navigateToInstanceView(instanceId: number): void {
    //     this.router.navigate(['/pages/process/instance-view', instanceId]);
    }
}