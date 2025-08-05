import {Component, OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {Router, RouterModule} from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import {NgClass, NgForOf, NgStyle} from "@angular/common";
import {DatasourceConfigService} from "../../layout/service/DatasourceConfig.service";
import {BpmServerModel} from "../../layout/model/bpm-server.model";
import {EcmServerModel} from "../../layout/model/ecm-server.model";
import {DbServerModel} from "../../layout/model/db-server.model";
import {Dialog} from "primeng/dialog";
import {ServerConfigService} from "../../core/services/ServerConfigService";

// @ts-ignore
@Component({
    selector: 'app-dataconfig',
    standalone: true,
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, AppFloatingConfigurator, NgClass , NgForOf , Dialog],
    templateUrl: './datasourceConfig.html',
    providers: [DatasourceConfigService]

})
export class DatasourceConfig implements OnInit{
    bpmServers: BpmServerModel[] = [];
    ecmServers: EcmServerModel[] = [];
    dbServers: DbServerModel[] = [];
    displayConfirmation: boolean = false;
    displayMessagePopup = false;   // ✅ New popup for messages
    popupMessage = '';             // ✅ Message to show in popup
    popupSuccess = true;


    constructor(
        private datasourceConfigService: DatasourceConfigService,
        private serverConfigService: ServerConfigService,
        private router: Router,
    ) {}

    ngOnInit(): void {
        this.bpmServers = this.datasourceConfigService.getBPMServers();
        this.ecmServers = this.datasourceConfigService.getECMServers();
        this.dbServers = this.datasourceConfigService.getDBServers();
    }

    deleteBPMServer(id: number): void {
        if (!id)
        {
            this.showPopup('Invalid server ID', false);
            return;
        }

        this.serverConfigService.deleteServer(id).subscribe({
            next: () => {
                this.bpmServers = this.bpmServers.filter(server => server.id !== id);

                this.showPopup('Server deleted successfully!', true);

                this.displayConfirmation = false;
            },
            error: (err) => {
                this.showPopup('Failed to delete server', false);
                console.error('Delete error:', err);
            }
        });
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
    private showPopup(message: string, isSuccess: boolean): void {
        this.popupMessage = message;
        this.popupSuccess = isSuccess;
        this.displayMessagePopup = true;
    }
}
