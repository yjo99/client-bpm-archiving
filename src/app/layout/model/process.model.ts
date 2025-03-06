import {InstanceModel} from "./instance.model";

export interface ProcessModel {
    id: number; // Unique identifier for the process
    name: string; // Name of the process
    description: string; // Description of the process
    version: string; // Version of the process
    createdDate: Date; // Date when the process was created
    instances: InstanceModel[]; // List of instances for this process
}