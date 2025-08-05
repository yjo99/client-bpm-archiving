import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InputText } from "primeng/inputtext";
import { NgClass, NgIf } from "@angular/common";
import { Button } from "primeng/button";
import { Checkbox } from "primeng/checkbox";
import {ServerConfigService} from "../../../core/services/ServerConfigService";
import { HttpErrorResponse } from '@angular/common/http';
import {ServerCode} from "../../../core/DTO/ServerCode";

@Component({
    selector: 'app-bpm-server-form',
    templateUrl: './bpm-server-form.component.html',
    imports: [
        InputText,
        ReactiveFormsModule,
        NgClass,
        Button,
        Checkbox,
        NgIf
    ],
    standalone: true
})
export class BpmServerFormComponent implements OnInit {
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
            contextPath: ['', Validators.required],
            repositoryName: ['', Validators.required],
            databaseType: ['', Validators.required],
            serverPort: ['', [Validators.required, Validators.min(1), Validators.max(65535)]],
            userName: ['', Validators.required],
            userPassword: ['', Validators.required],
            maximumParallelTransaction: ['', [Validators.required, Validators.min(1)]],
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
            this.showMessage('Connection successful!', true);
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
            ID: this.server?.ID
        };

        try {
            serverData.serverCode = ServerCode.BAW_01
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

        // Handle HTTP error responses
        if (error instanceof HttpErrorResponse) {
            // Try to get error message from response body
            if (error.error) {
                // Case 1: Error body is a string
                if (typeof error.error === 'string') {
                    errorMessage = error.error;
                }
                // Case 2: Error body is an object with message property
                else if (error.error.message) {
                    errorMessage = error.error.message;
                }
                // Case 3: Error body is an object with other properties
                else {
                    errorMessage = JSON.stringify(error.error);
                }
            } else {
                errorMessage = error.message || defaultMessage;
            }
        }
        // Handle regular Error objects
        else if (error instanceof Error) {
            errorMessage = error.message;
        }
        // Handle string errors
        else if (typeof error === 'string') {
            errorMessage = error;
        }

        this.showMessage(errorMessage, false);
    }
}