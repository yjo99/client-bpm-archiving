import {Injectable} from '@angular/core';
import {ProcessModel} from "../model/process.model";
import {InstanceModel} from "../model/instance.model";
import {ProcessStatus} from "../model/ProcessStatus";
import {HttpClient, HttpParams} from "@angular/common/http";
import {MessageService} from "primeng/api";
import {Observable} from "rxjs";
import {ProcessResponse} from "../../core/DTO/process.response";
import {environment} from "../../../environments/environment";

@Injectable({
    providedIn: 'root',
})
export class ProcessService {
    private apiUrl = '/api/processes'; // Update with your actual API endpoint

    constructor(
        private http: HttpClient,
        private messageService: MessageService
    ) {}

    getProcesses(page: number = 0, pageSize: number = 10): Observable<ProcessResponse> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('pageSize', pageSize.toString());

        return this.http.get<ProcessResponse>(`${environment.apiUrl}/api/processes`, { params });
    }

    // Optional: Keep the mock data for development
    getMockProcesses(): ProcessModel[] {
        return [
            {
                ID: '1',
                name: 'Sample Process',
                shortName: 'SP',
                description: 'Sample process description',
                lastModifiedBy: 'admin',
                defaultVersion: '1.0',
                lastModified_on: new Date().toISOString(),
                createdDate: new Date()
            }
        ];
    }
}