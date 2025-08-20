import { Component, Input, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EcmServerModel } from '../../../layout/model/ecm-server.model';
import { InputText } from 'primeng/inputtext';
import { NgClass, NgIf } from '@angular/common';
import { Button } from 'primeng/button';
import { Checkbox } from 'primeng/checkbox';
import {ServerConfigService} from "../../../core/services/ServerConfigService";
import {ServerCode} from "../../../core/DTO/ServerCode";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
    selector: 'app-ecm-server-form',
    templateUrl: './ecm-server-form-component.html',
    imports: [
        InputText,
        NgClass,
        NgIf,
        Button,
        ReactiveFormsModule
    ]
})
export class EcmServerFormComponent implements OnInit {
    form: FormGroup;
    isEditMode = false;
    @Input() server: EcmServerModel | null = null;
    testMessage: string | null = null;
    testSuccess = false;
    loading = false;

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private serverConfigService: ServerConfigService
    ) {
        this.form = this.fb.group({
            serverName: ['', Validators.required],
            serverHostName: ['', Validators.required],
            serverPort: ['', [Validators.required, Validators.min(1), Validators.max(65535)]],
            userName: ['', Validators.required],
            userPassword: ['', Validators.required],
            MaximumParallelTransactoin: ['', [Validators.min(0)]],
            useSecureConnection: [false],
            contextPath: ['', Validators.required],
            RepositoryName: [''],
        });
    }

    ngOnInit(): void {
        this.route.queryParams.subscribe((params) => {
            if (params['server']) {
                try {
                    const parsedServer: EcmServerModel = JSON.parse(params['server']);
                    if (parsedServer) {
                        this.server = parsedServer;
                        this.isEditMode = true;
                        this.form.patchValue({
                            ...this.server
                        });
                    }
                } catch (error) {
                    console.error('Error parsing server data:', error);
                }
            }
        });
    }

    async testConnection(): Promise<void> {
        const formValue = this.form.value;

        if (
            !formValue.serverHostName ||
            !formValue.serverPort ||
            !formValue.contextPath ||
            !formValue.userName ||
            !formValue.userPassword
        ) {
            this.showMessage('Please fill all required fields for connection test', false);
            return;
        }

        this.loading = true;

        const testRequest = {
            host: formValue.serverHostName,
            port: parseInt(formValue.serverPort),
            contextPath: formValue.contextPath,
            username: formValue.userName,
            password: formValue.userPassword
        };

        try {
            const response = await this.serverConfigService.testServerConnection(testRequest).toPromise();
            this.showMessage(response || 'Connection successful!', true);
        } catch (error) {
            this.handleError(error, 'Connection failed');
        } finally {
            this.loading = false;
        }
    }

    async onSubmit(): Promise<void> {
        if (this.form.invalid) {
            this.showMessage('Please fill all required fields', false);
            return;
        }

        this.loading = true;
        const formValue = this.form.value;

        const serverData = {
            ...formValue,
            useSecureConnection: formValue.useSecureConnection ? 1 : 0,
            id: this.server?.id,
            serverCode: ServerCode.ECM_01
        };

        try {
            if (this.isEditMode) {
                await this.serverConfigService.updateServer(serverData).toPromise();
                this.showMessage('Server updated successfully!', true);
            } else {
                await this.serverConfigService.addServer(serverData).toPromise();
                this.showMessage('Server added successfully!', true);
            }

            setTimeout(() => {
                this.router.navigate(['/pages/dataconfig']);
            }, 1500);
        } catch (error) {
            this.handleError(error, 'Operation failed');
        } finally {
            this.loading = false;
        }
    }

    private showMessage(message: string, isSuccess: boolean): void {
        this.testMessage = message;
        this.testSuccess = isSuccess;
        setTimeout(() => (this.testMessage = null), 3000);
    }

    private handleError(error: unknown, defaultMessage: string): void {
        let errorMessage = defaultMessage;

        if (error instanceof HttpErrorResponse) {
            if (error.error) {
                if (typeof error.error === 'string') {
                    errorMessage = error.error;
                }
                else if (error.error.message) {
                    errorMessage = error.error.message;
                }
                else {
                    errorMessage = JSON.stringify(error.error);
                }
            } else {
                errorMessage = error.message || defaultMessage;
            }
        }
        else if (error instanceof Error) {
            errorMessage = error.message;
        }
        else if (typeof error === 'string') {
            errorMessage = error;
        }

        this.showMessage(errorMessage, false);
    }
}
