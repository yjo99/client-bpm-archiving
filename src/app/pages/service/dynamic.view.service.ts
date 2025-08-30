// src/app/services/process.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {environment} from "../../../environments/environment";

export interface CoachDefinitionNodeDTO {
    label: string;
    viewUUID?: string | null;
    controlType?: string | null;
    binding?: string | null;
    children?: CoachDefinitionNodeDTO[];
}

@Injectable({
    providedIn: 'root'
})
export class DynamicViewService {

    private baseUrl = `${environment.apiUrl}/api/process`;

    constructor(private http: HttpClient) {}

    getInstanceDynamicView(id: string, versionId: string): Observable<CoachDefinitionNodeDTO[]> {
        const params = new HttpParams()
            .set('id', id)
            .set('versionId', versionId);

        return this.http.get<CoachDefinitionNodeDTO[]>(`${this.baseUrl}/xml`, { params })
            .pipe(
                catchError(this.handleError)
            );
    }

    private handleError(error: HttpErrorResponse) {
        let errorMessage = 'An unknown error occurred!';

        if (error.error instanceof ErrorEvent) {
            errorMessage = `Error: ${error.error.message}`;
        } else {
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;

            if (error.error && typeof error.error === 'string') {
                errorMessage += `\nDetails: ${error.error}`;
            } else if (error.error && error.error.message) {
                errorMessage += `\nDetails: ${error.error.message}`;
            }
        }

        console.error('ProcessService error:', error);
        return throwError(() => new Error(errorMessage));
    }
}
