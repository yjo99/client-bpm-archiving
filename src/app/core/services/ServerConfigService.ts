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
        return this.http.post(`${this.apiUrl}/add`, server, { responseType: 'text' as 'json' });
    }

    // Update an existing server
    updateServer(server: ServerData): Observable<any> {
        return this.http.put(`${this.apiUrl}/update`, server, { responseType: 'text' as 'json' });
    }

    // Delete a server
    deleteServer(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    // Test server connection
    testServerConnection(request: ServerConnectionRequest): Observable<any> {
        return this.http.post(`${this.apiUrl}/test-srv`, request, { responseType: 'text' as 'json' });
    }

    // Get all servers
    getAllServers(serverCode: string): Observable<ServerData[]> {
        return this.http.get<ServerData[]>(`${this.apiUrl}/getServer`, {
            params: { serverCode }
        });
    }

    // Get server by ID
    getServerById(id: number): Observable<ServerData> {
        return this.http.get<ServerData>(`${this.apiUrl}/${id}`);
    }
}
