import {Injectable} from '@angular/core';
import {ProcessModel} from "../model/process.model";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {ProcessResponse} from "../../core/DTO/process.response";
import {environment} from "../../../environments/environment";

@Injectable({
    providedIn: 'root',
})
export class ProcessService {
    private apiUrl = '/wizard/processes'; // Update with your actual API endpoint

    constructor(
        private http: HttpClient
    ) {}

    getProcesses(page: number = 0, pageSize: number = 10): Observable<ProcessResponse> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('pageSize', pageSize.toString());

        return this.http.get<ProcessResponse>(`${environment.apiUrl}/wizard/processes`, { params });
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
                createdDate: new Date(),
                configured: false
            }
        ];
    }
}