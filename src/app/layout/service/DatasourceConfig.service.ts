import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {BpmServerModel} from '../model/bpm-server.model'; // Import BpmServerModel
import {EcmServerModel} from '../model/ecm-server.model'; // Import EcmServerModel
import {DbServerModel} from '../model/db-server.model';
import {DatabaseType} from "../model/DatabaseType";
import {ServerConfigService} from "../../core/services/ServerConfigService";
import {ServerCode} from "../../core/DTO/ServerCode"; // Import DbServerModel
import {ServerData} from '../../core/DTO/ServerData'; // Import DbServerModel
@Injectable({
    providedIn: 'root', // Make the service available application-wide
})
export class DatasourceConfigService {
    constructor(private serverConfigService: ServerConfigService) {}

    private mapServer<T>(raw: any, extra: Partial<T> = {}): T {
        return {
            id: raw.id ?? 0,
            serverName: raw.serverName ?? '',
            serverHostName: raw.serverHostName ?? '',
            serverPort: raw.serverPort ?? '',
            userName: raw.userName ?? '',
            userPassword: raw.userPassword ?? '',
            maximumParallelTransaction: raw.maximumParallelTransaction ?? '',
            useSecureConnection: raw.useSecureConnection ?? 0,
            serverCode: raw.serverCode ?? '',
            contextPath: raw.contextPath ?? '',
            repositoryName: raw.repositoryName ?? '',
            databaseType: raw.databaseType ?? '',
            ...extra,
        } as T;
    }

    // ==================== BPM Servers ====================
    getBPMServers(): Observable<BpmServerModel[]> {
        return this.serverConfigService.getAllServers(ServerCode.BAW_01).pipe(
            map((servers: any[]) => servers.map(s => this.mapServer<BpmServerModel>(s)))
        );
    }

    // ==================== ECM Servers ====================
    getECMServers(): Observable<EcmServerModel[]> {
        return this.serverConfigService.getAllServers(ServerCode.ECM_01).pipe(
            map((servers: any[]) => servers.map(s => this.mapServer<EcmServerModel>(s)))
        );
    }

    // ==================== DB Servers ====================
    getDBServers(): Observable<DbServerModel[]> {
        return this.serverConfigService.getAllServers(ServerCode.DB_01).pipe(
            map((servers: any[]) => servers.map(s => this.mapServer<DbServerModel>(s)))
        );
    }
}