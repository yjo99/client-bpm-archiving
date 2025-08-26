export interface ProcessModel {
    ID: string;
    name: string;
    shortName: string;
    description: string;
    richDescription?: string;
    lastModifiedBy: string;
    defaultVersion: string;
    lastModified_on: string;
    createdDate?: Date;
    configured: boolean;
}