// instances.model.ts
export interface Overview {
    Active: number;
    Total: number;
    Completed: number;
    Failed: number;
    Terminated: number;
    Did_not_Start: number;
    Suspended: number;
}

export interface Processes {
    piid: string;
    name: string;
    bpdName: string;
    snapshotID: string;
    executionState: string;
    lastModificationTime: string;
    data?: any; // Using any for JsonNode equivalent
}

export interface Instances {
    overview: Overview;
    processes: Processes[];
}

export interface ProcessSnapshotDTO {
    name: string;
    snapshotID: string;
    pageNumber?: number;
    pageSize?: number;
}

export interface InstancesListDTO {
    instancesIDs: string[];
}

export interface DeleteSnapshotDTO {
    processAcronym: string;
    snapshotAcronym: string[];
}

export interface FailedOperations {
    instanceId: string;
    errorNumber: string;
    errorMessage: string;
}

export interface ProcessDetails {
    data: string;
}

export interface TerminatedInstanceDetails {
    failedOperations: FailedOperations[];
    processDetails: ProcessDetails[];
    succeeded: string;
    failed: string;
}

export interface DeleteSnapshotDetails {
    error_number: string;
    error_message: string;
    error_message_parameters: string[];
    description: string;
}

export interface Result<T> {
    status: string;
    data: T;
}