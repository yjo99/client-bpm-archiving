import {ProcessModel} from "../../layout/model/process.model";

export interface ProcessResponse {
    processAppsList: ProcessModel[];
    totalCount?: number;
    page?: number;
    pageSize?: number;
}