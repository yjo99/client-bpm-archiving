import {Injectable} from '@angular/core';
import {ProcessModel} from "../model/process.model";
import {InstanceModel} from "../model/instance.model";
import {ProcessStatus} from "../model/ProcessStatus";

@Injectable({
    providedIn: 'root',
})
export class ProcessService {
    private processes: ProcessModel[] = [
        {
            id: 1,
            name: 'Employee Onboarding',
            description: 'Process for onboarding new employees.',
            version: '1.0',
            createdDate: new Date('2023-10-01'),
            instances: [
                {
                    id: 101,
                    processId: 1,
                    status: ProcessStatus.Completed,
                    startDate: new Date('2023-10-02'),
                    endDate: new Date('2023-10-03'),
                    createdBy: 'Admin',
                },
                {
                    id: 102,
                    processId: 1,
                    status: ProcessStatus.Running,
                    startDate: new Date('2023-10-04'),
                    createdBy: 'Manager',
                },
            ],
        },
        {
            id: 2,
            name: 'Leave Approval',
            description: 'Process for approving employee leave requests.',
            version: '1.0',
            createdDate: new Date('2023-09-15'),
            instances: [
                {
                    id: 201,
                    processId: 2,
                    status: ProcessStatus.Failed,
                    startDate: new Date('2023-09-16'),
                    endDate: new Date('2023-09-17'),
                    createdBy: 'HR',
                },
                {
                    id: 202,
                    processId: 2,
                    status: ProcessStatus.Completed,
                    startDate: new Date('2023-09-18'),
                    createdBy: 'Employee',
                },
            ],
        },
    ];

    constructor() {}

    // Get all processes with their instances
    getProcesses(): ProcessModel[] {
        return this.processes;
    }

    // Get instances for a specific process
    getInstancesByProcessId(processId: number): InstanceModel[] {
        const process = this.processes.find((p) => p.id === processId);
        return process ? process.instances : [];
    }
}