// layout/model/process.model.ts
export interface ProcessModel {
  id: string;
  name: string;
  description: string;
  richDescription: string;
  lastModifiedBy: string;
  version: string;
  createdDate: Date;
  shortName: string;
}
