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
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, AppFloatingConfigurator , NgForOf , Dialog],
    templateUrl: './datasourceConfig.html',
    providers: [DatasourceConfigService]

})
export class DatasourceConfig implements OnInit{
    bpmServers: BpmServerModel[] = [];
    ecmServers: EcmServerModel[] = [];
    dbServers: DbServerModel[] = [];
    displayMessagePopup = false;   // ✅ New popup for messages
    popupMessage = '';             // ✅ Message to show in popup
    popupSuccess = true;
    selectedServerId: number | null = null;
    selectedServerType: 'BPM' | 'ECM' | 'DB' | null = null;
    displayConfirmation = false;


    constructor(
        private datasourceConfigService: DatasourceConfigService,
        private serverConfigService: ServerConfigService,
        private router: Router,
    ) {}

    ngOnInit(): void {
        this.datasourceConfigService.getBPMServers().subscribe(data => {
            this.bpmServers = data;
        });
        this.datasourceConfigService.getECMServers().subscribe(data => {
            this.ecmServers = data;
        });
        this.datasourceConfigService.getDBServers().subscribe(data => {
            this.dbServers = data;
        });
    }

    deleteBPMServer(id: number): void {
        this.deleteServer(id,'BPM')
        this.datasourceConfigService.getBPMServers().subscribe(data => {
            this.bpmServers = data;
        });
        this.displayConfirmation = false;

    }
    onUpdateBPMServer(server: BpmServerModel): void {
        this.router.navigate(['/pages/dataconfig/bpmform'], {
            queryParams: { server: JSON.stringify(server) },
        });
    }

    deleteECMServer(id: number): void {
        this.deleteServer(id,'ECM')
        this.datasourceConfigService.getECMServers().subscribe(data => {
            this.ecmServers = data;
        });
        this.displayConfirmation = false;

    }
    onUpdateECMServer(server: EcmServerModel): void {
        this.router.navigate(['/pages/dataconfig/ecmform'], {
            queryParams: { server: JSON.stringify(server) },
        });
    }

    deleteDBServer(id: number): void {
        this.deleteServer(id,'DB')
        this.datasourceConfigService.getDBServers().subscribe(data => {
            this.dbServers = data;
        });
        this.displayConfirmation = false;
    }
    onUpdateDBServer(server: DbServerModel): void {
        this.router.navigate(['/pages/dataconfig/dbform'], {
            queryParams: { server: JSON.stringify(server) },
        });
    }

    openConfirmation(id: number, type: 'BPM' | 'ECM' | 'DB') {
        this.selectedServerId = id;
        this.selectedServerType = type;
        this.displayConfirmation = true;
    }
    confirmDelete() {
        if (this.selectedServerId && this.selectedServerType) {
            this.deleteServer(this.selectedServerId, this.selectedServerType);
        }
        this.closeConfirmation();
    }
    closeConfirmation() {
        this.displayConfirmation = false;
        this.selectedServerId = null;
        this.selectedServerType = null;
    }

    private showPopup(message: string, isSuccess: boolean): void {
        this.popupMessage = message;
        this.popupSuccess = isSuccess;
        this.displayMessagePopup = true;
    }

    deleteServer(id: number, type: 'BPM' | 'ECM' | 'DB'): void {
        if (!id) {
            this.showPopup('Invalid server ID', false);
            return;
        }

        this.serverConfigService.deleteServer(id).subscribe({
            next: () => {
                if (type === 'BPM') {
                    this.bpmServers = this.bpmServers.filter(server => server.id !== id);
                } else if (type === 'ECM') {
                    this.ecmServers = this.ecmServers.filter(server => server.id !== id);
                } else if (type === 'DB') {
                    this.dbServers = this.dbServers.filter(server => server.id !== id);
                }
                this.displayConfirmation = false;
                this.showPopup('Server deleted successfully', true);
            },
            error: (err) => {
                console.error('Delete error:', err);
                this.showPopup('Failed to delete server', false);
            }
        });
    }

}
