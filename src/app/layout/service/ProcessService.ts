import { ProcessModel } from "../model/process.model";
import { ProcessResponse } from "../../core/DTO/process.response";
import { environment } from "../../../environments/environment";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import { Observable } from "rxjs";
import {Injectable} from "@angular/core";
// DTO Interfaces matching your Java DTOs
export interface ProcessConfigDto {
    appID: string;
    acronym: string;
    name: string;
    retentionStartDate: string;
    numberPeriodArch: string;
    instanceArchNumber: string;
    assignedGroups: string[];
    assignedUsers: string[];
    isConfigured: boolean;
}

export interface ProcessAppGroupsUpdateDto {
    appID: string;
    assignedGroups: string[];
    assignedUsers: string[];
}

export interface SnapshotDto {
    ID: number;
    snapshotID: string;
    branchID: string;
    acronym: string;
    isActive: string;
    activeSince: string;
    createdOn: string;
}

export interface InstalledSnapshots {
    name: string;
    acronym: string;
    active: string;
    createdOn: string;
    snapshotTip: boolean;
    branchID: string;
    branchName: string;
    ID: string;
}

@Injectable({
    providedIn: 'root',
})
export class ProcessService {
    private apiUrl = `${environment.apiUrl}/wizard`;

    constructor(private http: HttpClient) {}

    // Get processes with pagination
    getProcesses(page: number = 0, pageSize: number = 10): Observable<ProcessResponse> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('pageSize', pageSize.toString());

        return this.http.get<ProcessResponse>(`${this.apiUrl}/processes`, { params });
    }

    // Get installed snapshots for a process
    getInstalledSnapshots(processID: string): Observable<InstalledSnapshots[]> {
        const params = new HttpParams().set('processID', processID);
        return this.http.get<InstalledSnapshots[]>(`${this.apiUrl}/snapshots`, { params });
    }

    // Configure a process
    configProcess(processConfigDto: ProcessConfigDto): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post(`${this.apiUrl}/config/process`, processConfigDto, {
            headers,
            responseType: 'text' // Since the backend returns ResponseEntity<String>
        });
    }

    // Delete process app groups
    deleteProcessAppGroups(appID: string): Observable<any> {
        const params = new HttpParams().set('appID', appID);
        return this.http.delete(`${this.apiUrl}/config/process`, {
            params,
            responseType: 'text'
        });
    }

    // Update process app groups
    updateProcessAppGroups(processAppGroupsUpdateDto: ProcessAppGroupsUpdateDto): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.put(`${this.apiUrl}/config/process`, processAppGroupsUpdateDto, {
            headers,
            responseType: 'text'
        });
    }

    // Get process app configuration
    getProcessAppConfig(appID: string): Observable<ProcessConfigDto> {
        const params = new HttpParams().set('appID', appID);
        return this.http.get<ProcessConfigDto>(`${this.apiUrl}/config/process`, { params });
    }

    // Configure snapshots
    snapshotConfiguration(snapshotDtoList: SnapshotDto[]): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post(`${this.apiUrl}/config/snapshots`, snapshotDtoList, {
            headers,
            responseType: 'text'
        });
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