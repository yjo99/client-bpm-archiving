import {ProcessStatus} from "./ProcessStatus";

export interface InstanceModel {
    id: number; // Unique identifier for the instance
    processId: number; // ID of the process this instance belongs to
    status: ProcessStatus; // Current status of the instance
    startDate: Date; // Date when the instance started
    endDate?: Date; // Date when the instance ended (optional)
    createdBy: string; // User who started the instance
}