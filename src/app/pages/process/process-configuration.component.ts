// pages/process/configure/process-configuration.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ProcessModel } from "../../layout/model/process.model";
import {User} from "../../layout/model/user.model";
import {Group} from "../../layout/model/group.model";
import {ProcessConfigDto, ProcessService} from "../../layout/service/ProcessService";
import {SuperAdminService} from "../../layout/service/super-admin.service";
import { CheckboxModule } from 'primeng/checkbox';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
    selector: 'app-process-configuration',
    templateUrl: './process-configuration.component.html',
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        CardModule,
        InputTextModule,
        CalendarModule,
        MultiSelectModule,
        ToastModule,
        CheckboxModule,
        ProgressSpinnerModule
    ],
    providers: [MessageService]
})
export class ProcessConfigurationComponent implements OnInit {
    process: ProcessModel | null = null;
    processId: string | undefined = '';

    // Form model
    configurationForm: ProcessConfigDto = {
        appID: '',
        acronym: '',
        name: '',
        retentionStartDate: '',
        numberPeriodArch: '',
        instanceArchNumber: '',
        assignedGroups: [],
        assignedUsers: [],
        isConfigured: true
    };

    // Data for dropdowns
    allUsers: User[] = [];
    allGroups: Group[] = [];

    // Loading states
    loadingUsers = false;
    loadingGroups = false;
    saving = false;
    isEditMode = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private messageService: MessageService,
        private superAdminService: SuperAdminService,
        private processService: ProcessService
    ) {}

    ngOnInit(): void {
        console.log('History state:', history.state);

        // Get process data from history state (works after navigation)
        if (history.state && history.state.processData) {
            this.process = history.state.processData;
            this.processId = this.process?.ID;
            console.log('Process set from history state:', this.process);

            // Check if we're editing an existing configuration
            this.checkIfEditMode();
        }
        // Try to get from navigation state (works during navigation)
        else {
            const navigation = this.router.getCurrentNavigation();
            console.log('Navigation state:', navigation?.extras.state);

            if (navigation?.extras?.state?.["processData"]) {
                this.process = navigation.extras.state["processData"];
                this.processId = this.process?.ID;
                console.log('Process set from navigation state:', this.process);

                // Check if we're editing an existing configuration
                this.checkIfEditMode();
            }
            // If still no data, show error and redirect back
            else {
                console.warn('No process data found in state');
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Process data not available. Please go back and try again.'
                });

                // Redirect back after a short delay
                setTimeout(() => {
                    this.router.navigate(['/pages/process']);
                }, 2000);
                return;
            }
        }

        // Load users and groups for selection
        this.loadUsers();
        this.loadGroups();
    }

    checkIfEditMode(): void {
        if (this.process && this.process.ID) {
            // Check if this process already has a configuration
            this.processService.getProcessAppConfig(this.process.ID).subscribe({
                next: (config: ProcessConfigDto) => {
                    if (config) {
                        this.isEditMode = true;
                        this.configurationForm = config;
                    } else {
                        this.initializeForm();
                    }
                },
                error: (error: any) => {
                    console.log('No existing configuration found, creating new one', error);
                    this.initializeForm();
                }
            });
        }
    }

    initializeForm(): void {
        if (this.process) {
            this.configurationForm = {
                appID: this.process.ID || '',
                acronym: this.process.shortName || '',
                name: this.process.name || '',
                retentionStartDate: '',
                numberPeriodArch: '',
                instanceArchNumber: '',
                assignedGroups: [],
                assignedUsers: [],
                isConfigured: true
            };
        }
    }

    loadUsers(): void {
        this.loadingUsers = true;
        this.superAdminService.getAllUsers().subscribe({
            next: (users) => {
                this.allUsers = users;
                this.loadingUsers = false;
            },
            error: (error) => {
                console.error('Error loading users:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load users'
                });
                this.loadingUsers = false;
            }
        });
    }

    loadGroups(): void {
        this.loadingGroups = true;
        this.superAdminService.getAllGroups().subscribe({
            next: (groups) => {
                this.allGroups = groups;
                this.loadingGroups = false;
            },
            error: (error) => {
                console.error('Error loading groups:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load groups'
                });
                this.loadingGroups = false;
            }
        });
    }

    saveConfiguration(): void {
        this.saving = true;

        // Validate form
        if (!this.isFormValid()) {
            this.saving = false;
            return;
        }

        // Call the API service
        this.processService.configProcess(this.configurationForm).subscribe({
            next: (response: any) => {
                this.saving = false;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Process configuration saved successfully'
                });

                // Navigate back to processes list
                setTimeout(() => {
                    this.router.navigate(['/pages/process']);
                }, 1500);
            },
            error: (error: any) => {
                this.saving = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to save configuration: ' + error.message
                });
                console.error('Error saving configuration:', error);
            }
        });
    }

    isFormValid(): boolean {
        if (!this.configurationForm.appID) {
            this.messageService.add({
                severity: 'error',
                summary: 'Validation Error',
                detail: 'Application ID is required'
            });
            return false;
        }

        if (!this.configurationForm.acronym) {
            this.messageService.add({
                severity: 'error',
                summary: 'Validation Error',
                detail: 'Acronym is required'
            });
            return false;
        }

        if (!this.configurationForm.name) {
            this.messageService.add({
                severity: 'error',
                summary: 'Validation Error',
                detail: 'Name is required'
            });
            return false;
        }

        return true;
    }

    cancel(): void {
        this.router.navigate(['/pages/process']);
    }
}