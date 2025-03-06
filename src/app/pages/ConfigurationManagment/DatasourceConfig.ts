import {Component, OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import {NgForOf, NgStyle} from "@angular/common";
import {DatasourceConfigService} from "../../layout/service/DatasourceConfig.service";
import {BpmServerModel} from "../../layout/model/bpm-server.model";
import {EcmServerModel} from "../../layout/model/ecm-server.model";
import {DbServerModel} from "../../layout/model/db-server.model";
import {Tag} from "primeng/tag";

// @ts-ignore
@Component({
    selector: 'app-dataconfig',
    standalone: true,
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, AppFloatingConfigurator, NgForOf],
    templateUrl: './datasourceConfig.html',
    providers: [DatasourceConfigService]

})
export class DatasourceConfig implements OnInit{
    bpmServers: BpmServerModel[] = [];
    ecmServers: EcmServerModel[] = [];
    dbServers: DbServerModel[] = [];

    constructor(private datasourceConfigService: DatasourceConfigService) {}

    ngOnInit(): void {
        this.bpmServers = this.datasourceConfigService.getBPMServers();
        this.ecmServers = this.datasourceConfigService.getECMServers();
        this.dbServers = this.datasourceConfigService.getDBServers();
    }

    deleteBPMServer(id: number): void {
        this.datasourceConfigService.deleteBPMServer(id);
        this.bpmServers = this.datasourceConfigService.getBPMServers(); // Refresh the list
    }

    deleteECMServer(id: number): void {
        this.datasourceConfigService.deleteECMServer(id);
        this.ecmServers = this.datasourceConfigService.getECMServers(); // Refresh the list
    }

    deleteDBServer(id: number): void {
        this.datasourceConfigService.deleteDBServer(id);
        this.dbServers = this.datasourceConfigService.getDBServers(); // Refresh the list
    }


}
