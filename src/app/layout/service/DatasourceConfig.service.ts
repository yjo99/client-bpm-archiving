import { Injectable } from '@angular/core';

import { BpmServerModel } from '../model/bpm-server.model'; // Import BpmServerModel
import { EcmServerModel } from '../model/ecm-server.model'; // Import EcmServerModel
import { DbServerModel } from '../model/db-server.model'; // Import DbServerModel
@Injectable({
    providedIn: 'root', // Make the service available application-wide
})
export class DatasourceConfigService {
    // Mock data for BpmServerModel
    private bpmServers: BpmServerModel[] = [
        {
            id: 1,
            serverName: 'BPM Server 1',
            serverHostName: 'bpm1.example.com',
            serverPort: 8080,
            userName: 'admin',
            userPassword: 'password',
            MaximumParallelTransactoin: 100,
            useSecureConnection: true,
        },
        {
            id: 2,
            serverName: 'BPM Server 2',
            serverHostName: 'bpm2.example.com',
            serverPort: 8081,
            userName: 'admin',
            userPassword: 'password',
            MaximumParallelTransactoin: 150,
            useSecureConnection: false,
        },
    ];

    // Mock data for EcmServerModel
    private ecmServers: EcmServerModel[] = [
        {
            id: 1,
            serverName: 'ECM Server 1',
            serverHostName: 'ecm1.example.com',
            serverPort: 8082,
            userName: 'admin',
            userPassword: 'password',
            MaximumParallelTransactoin: 50,
            useSecureConnection: true,
            contextPath: '/ecm1',
            RepositoryName: 'Repo1',
        },
        {
            id: 2,
            serverName: 'ECM Server 2',
            serverHostName: 'ecm2.example.com',
            serverPort: 8083,
            userName: 'admin',
            userPassword: 'password',
            MaximumParallelTransactoin: 75,
            useSecureConnection: false,
            contextPath: '/ecm2',
            RepositoryName: 'Repo2',
        },
    ];

    // Mock data for DbServerModel
    private dbServers: DbServerModel[] = [
        {
            id: 1,
            serverName: 'DB Server 1',
            serverHostName: 'db1.example.com',
            serverPort: 5432,
            userName: 'admin',
            userPassword: 'password',
            MaximumParallelTransactoin: 200,
            useSecureConnection: true,
            databaseType: 'PostgreSQL',
        },
        {
            id: 2,
            serverName: 'DB Server 2',
            serverHostName: 'db2.example.com',
            serverPort: 3306,
            userName: 'admin',
            userPassword: 'password',
            MaximumParallelTransactoin: 300,
            useSecureConnection: false,
            databaseType: 'MySQL',
        },
    ];

    constructor() {}


    // ==================== BpmServerModel Methods ====================

    getBPMServers(): BpmServerModel[] {
        return this.bpmServers;
    }

    addBPMServer(server: BpmServerModel): void {
        this.bpmServers.push(server);
    }

    updateBPMServer(id: number, updatedServer: BpmServerModel): void {
        const index = this.bpmServers.findIndex((s) => s.id === id);
        if (index !== -1) {
            this.bpmServers[index] = updatedServer;
        }
    }

    deleteBPMServer(id: number): void {
        this.bpmServers = this.bpmServers.filter((s) => s.id !== id);
    }

    // ==================== EcmServerModel Methods ====================

    getECMServers(): EcmServerModel[] {
        return this.ecmServers;
    }

    addECMServer(server: EcmServerModel): void {
        this.ecmServers.push(server);
    }

    updateECMServer(id: number, updatedServer: EcmServerModel): void {
        const index = this.ecmServers.findIndex((s) => s.id === id);
        if (index !== -1) {
            this.ecmServers[index] = updatedServer;
        }
    }

    deleteECMServer(id: number): void {
        this.ecmServers = this.ecmServers.filter((s) => s.id !== id);
    }

    // ==================== DbServerModel Methods ====================

    getDBServers(): DbServerModel[] {
        return this.dbServers;
    }

    addDBServer(server: DbServerModel): void {
        this.dbServers.push(server);
    }

    updateDBServer(id: number, updatedServer: DbServerModel): void {
        const index = this.dbServers.findIndex((s) => s.id === id);
        if (index !== -1) {
            this.dbServers[index] = updatedServer;
        }
    }

    deleteDBServer(id: number): void {
        this.dbServers = this.dbServers.filter((s) => s.id !== id);
    }
}