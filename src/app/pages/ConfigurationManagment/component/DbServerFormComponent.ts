import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {DbServerModel} from '../../../layout/model/db-server.model';
import {InputText} from 'primeng/inputtext';
import {NgClass, NgIf} from '@angular/common';
import {Button} from 'primeng/button';
import {Checkbox} from 'primeng/checkbox';
import {DropdownModule} from 'primeng/dropdown';
import {DatabaseType} from "../../../layout/model/DatabaseType";
import {dt} from "@primeng/themes";
import {ServerConfigService} from "../../../core/services/ServerConfigService";
import {HttpErrorResponse} from "@angular/common/http";
import {ServerCode} from "../../../core/DTO/ServerCode";

@Component({
    selector: 'app-db-server-form',
    standalone: true,
    templateUrl: 'db-server-form-component.html',
    imports: [
        InputText,
        NgClass,
        NgIf,
        Button,
        ReactiveFormsModule,
        DropdownModule,
    ]
})
export class DbServerFormComponent implements OnInit {
    form: FormGroup;
    isEditMode = false;
    @Input() server: any = null;
    testMessage: string | null = null;
    testSuccess: boolean = false;
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
            maximumParallelTransaction: ['', [Validators.required, Validators.min(1)]],
            databaseType: ['', Validators.required],
            useSecureConnection: [false],
        });
    }

    ngOnInit(): void {
        this.route.queryParams.subscribe((params) => {
            if (params['server']) {
                try {
                    const parsedServer = JSON.parse(params['server']);
                    if (parsedServer) {
                        this.server = parsedServer;
                        this.isEditMode = true;
                        this.form.patchValue({
                            ...this.server,
                            useSecureConnection: this.server.useSecureConnection === 1
                        });
                    }
                } catch (error) {
                    console.error('Error parsing server data:', error);
                }
            }
        });
    }

    async testConnection(): Promise<void> {
        if (this.form.invalid) {
            this.showMessage('Please fill all required fields', false);
            return;
        }

        this.loading = true;
        const formValue = this.form.value;

        const testRequest = {
            host: formValue.serverHostName,
            port: parseInt(formValue.serverPort),
            contextPath: formValue.contextPath,
            username: formValue.userName,
            password: formValue.userPassword
        };

        try {
            const response = await this.serverConfigService.testServerConnection(testRequest).toPromise();
            // Response is now plain text or success message
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
            ID: this.server?.ID,
            serverCode: 'test' // Changed from ServerCode.BAW_01 to 'test'
        };

        try {
            serverData.serverCode = ServerCode.DB_01
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
