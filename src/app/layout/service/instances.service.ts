// instances.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
    Instances,
    ProcessSnapshotDTO,
    InstancesListDTO,
    DeleteSnapshotDTO,
    TerminatedInstanceDetails,
    DeleteSnapshotDetails,
    Result,
    Processes
} from '../model/instances.model';

@Injectable({
    providedIn: 'root'
})
export class InstancesService {
    private apiUrl = `${environment.apiUrl}/instances`;

    constructor(private http: HttpClient) {}

    // Error handling method
    private handleError(error: HttpErrorResponse) {
        let errorMessage = 'An unknown error occurred!';

        if (error.error instanceof ErrorEvent) {
            // Client-side error
            errorMessage = `Error: ${error.error.message}`;
        } else {
            // Server-side error
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;

            if (error.error && typeof error.error === 'string') {
                errorMessage += `\nDetails: ${error.error}`;
            } else if (error.error && error.error.message) {
                errorMessage += `\nDetails: ${error.error.message}`;
            }
        }

        console.error('InstancesService error:', error);
        return throwError(() => new Error(errorMessage));
    }

    /**
     * Get all instances by snapshot ID with pagination
     * @param processSnapshotDTO The snapshot DTO containing name, snapshotID, pageNumber, and pageSize
     */
    getAllInstancesBySnapshotID(processSnapshotDTO: ProcessSnapshotDTO): Observable<Instances> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        return this.http.post<Instances>(this.apiUrl, processSnapshotDTO, { headers })
            .pipe(
                catchError(this.handleError)
            );
    }

    /**
     * Get all instances by process name with optional filters
     * @param name Username
     * @param password Password
     * @param processName Process name
     * @param status Optional status filter
     * @param modifiedAfter Optional modified after date
     * @param modifiedBefore Optional modified before date
     */
    getAllInstancesByProcessName(
        name: string,
        password: string,
        processName: string,
        status?: string,
        modifiedAfter?: string,
        modifiedBefore?: string
    ): Observable<Instances> {
        let params = new HttpParams()
            .set('name', name)
            .set('password', password)
            .set('processName', processName);

        if (status) {
            params = params.set('status', status);
        }
        if (modifiedAfter) {
            params = params.set('modifiedAfter', modifiedAfter);
        }
        if (modifiedBefore) {
            params = params.set('modifiedBefore', modifiedBefore);
        }

        return this.http.get<Instances>(this.apiUrl, { params })
            .pipe(
                catchError(this.handleError)
            );
    }

    /**
     * Terminate multiple instances
     * @param instancesIDs List of instance IDs to terminate
     */
    terminateInstances(instancesIDs: InstancesListDTO): Observable<TerminatedInstanceDetails> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        return this.http.post<TerminatedInstanceDetails>(`${this.apiUrl}/terminate`, instancesIDs, { headers })
            .pipe(
                catchError(this.handleError)
            );
    }

    /**
     * Delete snapshot
     * @param deleteSnapshotDTO Snapshot deletion DTO
     */
    deleteSnapshot(deleteSnapshotDTO: DeleteSnapshotDTO): Observable<DeleteSnapshotDetails> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        return this.http.delete<DeleteSnapshotDetails>(`${this.apiUrl}/snapshot`, {
            headers,
            body: deleteSnapshotDTO // DELETE with body is supported
        }).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Get instances objects - using POST since we need to send request body
     * @param instancesIDs List of instance IDs
     */
    getInstancesObject(instancesIDs: InstancesListDTO): Observable<Result<any>> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        // Use POST instead of GET since we need to send a request body
        return this.http.post<Result<any>>(`${this.apiUrl}/objects`, instancesIDs, { headers })
            .pipe(
                catchError(this.handleError)
            );
    }

    /**
     * Configure instances
     * @param instances List of processes for configuration
     */
    instancesConfiguration(instances: Processes[]): Observable<string> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        return this.http.post(`${this.apiUrl}/config/instances`, instances, {
            headers,
            responseType: 'text'
        }).pipe(
            catchError(this.handleError)
        );
    }
}