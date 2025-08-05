import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {ServerData} from "../DTO/ServerData";
import {ServerConnectionRequest} from "../DTO/ServerConnectionRequest";
import {environment} from "../../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class ServerConfigService {
    private apiUrl = `${environment.apiUrl}/api/server`;

    constructor(private http: HttpClient) { }

    // Add a new server
    addServer(server: ServerData): Observable<any> {
        return this.http.post(`${this.apiUrl}/add`, server);
    }

    // Update an existing server
    updateServer(server: ServerData): Observable<ServerData> {
        return this.http.put<ServerData>(`${this.apiUrl}/update`, server);
    }

    // Delete a server
    deleteServer(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    // Test server connection
    testServerConnection(request: ServerConnectionRequest): Observable<any> {
        return this.http.post(`${this.apiUrl}/test-srv`, request);
    }

    // Get all servers (if you have this endpoint)
    getAllServers(): Observable<ServerData[]> {
        return this.http.get<ServerData[]>(this.apiUrl);
    }

    // Get server by ID (if you have this endpoint)
    getServerById(id: number): Observable<ServerData> {
        return this.http.get<ServerData>(`${this.apiUrl}/${id}`);
    }
}
