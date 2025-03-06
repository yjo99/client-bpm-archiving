import {Component, OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {Router, RouterModule} from '@angular/router';
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
import {ConfirmPopup} from "primeng/confirmpopup";
import {ConfirmationService} from "primeng/api";
import {Dialog} from "primeng/dialog";

// @ts-ignore
@Component({
    selector: 'app-dataconfig',
    standalone: true,
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, AppFloatingConfigurator, NgForOf, ConfirmPopup, Dialog],
    templateUrl: './datasourceConfig.html',
    providers: [DatasourceConfigService]

})
export class DatasourceConfig implements OnInit{
    bpmServers: BpmServerModel[] = [];
    ecmServers: EcmServerModel[] = [];
    dbServers: DbServerModel[] = [];
    displayConfirmation: boolean = false;


    constructor(
        private datasourceConfigService: DatasourceConfigService,
        private router: Router,
    ) {}

    ngOnInit(): void {
        this.bpmServers = this.datasourceConfigService.getBPMServers();
        this.ecmServers = this.datasourceConfigService.getECMServers();
        this.dbServers = this.datasourceConfigService.getDBServers();
    }

    deleteBPMServer(id: number): void {
        this.datasourceConfigService.deleteBPMServer(id);
        this.bpmServers = this.datasourceConfigService.getBPMServers(); // Refresh the list
        this.displayConfirmation = false;

    }
    onUpdateBPMServer(server: BpmServerModel): void {
        this.router.navigate(['/pages/dataconfig/bpmform'], {
            queryParams: { server: JSON.stringify(server) },
        });
    }

    deleteECMServer(id: number): void {
        this.datasourceConfigService.deleteECMServer(id);
        this.ecmServers = this.datasourceConfigService.getECMServers(); // Refresh the list
        this.displayConfirmation = false;

    }
    onUpdateECMServer(server: EcmServerModel): void {
        this.router.navigate(['/pages/dataconfig/ecmform'], {
            queryParams: { server: JSON.stringify(server) },
        });
    }

    deleteDBServer(id: number): void {
        this.datasourceConfigService.deleteDBServer(id);
        this.dbServers = this.datasourceConfigService.getDBServers(); // Refresh the list
        this.displayConfirmation = false;
    }
    onUpdateDBServer(server: DbServerModel): void {
        this.router.navigate(['/pages/dataconfig/dbform'], {
            queryParams: { server: JSON.stringify(server) },
        });
    }

    openConfirmation() {
        this.displayConfirmation = true;
    }

    closeConfirmation() {
        this.displayConfirmation = false;
    }

}
