import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import {ProcessService} from "../../layout/service/ProcessService";
import {ProcessModel} from "../../layout/model/process.model";
import {DataView} from "primeng/dataview";
import {AppFloatingConfigurator} from "../../layout/component/app.floatingconfigurator";
import {SelectButton} from "primeng/selectbutton";
import {FormsModule} from "@angular/forms";
import {DatePipe, NgClass, NgForOf} from "@angular/common";
import {Tag} from "primeng/tag";
import {TableModule} from "primeng/table";
import {ProcessStatus} from "../../layout/model/ProcessStatus";
import {Router} from "@angular/router";

@Component({
    selector: 'app-processes',
    templateUrl: './process-managment.html',
    imports: [
        DataView,
        AppFloatingConfigurator,
        SelectButton,
        FormsModule,
        NgClass,
        TableModule,
        NgForOf,
        DatePipe
    ],
    providers: [MessageService]
})
export class ProcessesManagement implements OnInit {
    processes: ProcessModel[] = [];
    layout: 'list' | 'grid' = 'list';
    options = ['list', 'grid'];

    constructor(
        private processService: ProcessService,
        private messageService: MessageService,
        private router: Router
        ) {}

    ngOnInit(): void {
        this.loadProcesses();
    }

    loadProcesses(): void {
        this.processes = this.processService.getProcesses();
    }

    getInstanceSeverity(status: ProcessStatus): string {
        switch (status.toLowerCase()) {
            case ProcessStatus.Completed: return 'success';
            // case 'stopped': return 'warning';
            // case 'failed': return 'danger';
            default: return 'info';
        }
    }

    // Navigate to InstanceListManagement with processId and processName as query parameters
    viewInstances(processId: number, processName: string): void {
        this.router.navigate(['/pages/process/instance', processId, 'instances'], {
            queryParams: { name: processName }, // Pass processName as a query parameter
        });
    }
}
