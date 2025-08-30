import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CoachDefinitionNodeDTO, DynamicViewService } from "../service/dynamic.view.service";
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import {FormsModule} from "@angular/forms";
import { CommonModule } from "@angular/common";
import {DropdownModule} from "primeng/dropdown";
import {CheckboxModule} from "primeng/checkbox";
import {RadioButtonModule} from "primeng/radiobutton";
import {PanelModule} from "primeng/panel";
import {ButtonModule} from "primeng/button";
import {ToastModule} from "primeng/toast";
import {InputTextModule} from "primeng/inputtext";
import {TableModule} from "primeng/table";
import {CalendarModule} from "primeng/calendar";
import {FileUploadModule} from "primeng/fileupload";
import {CardModule} from "primeng/card";
import {TryCatchDirective} from "./try-catch.directive";
import {DynamicRendererComponent} from "./dynamic.render.component";
import {MessagesModule} from "primeng/messages";
import {MessageModule} from "primeng/message";
import {ProgressSpinnerModule} from "primeng/progressspinner";

@Component({
    imports: [
        CommonModule,
        FormsModule,

        // PrimeNG
        ButtonModule,
        ToastModule,
        PanelModule,
        InputTextModule,
        DropdownModule,
        CheckboxModule,
        RadioButtonModule,
        TableModule,
        CalendarModule,
        FileUploadModule,
        CardModule,
        ProgressSpinnerModule,
        MessagesModule,
        MessageModule,

        // Custom
        DynamicRendererComponent
    ],
    providers: [MessageService],
    selector: 'app-dynamic-view',
    templateUrl: './dynamic.view.component.html'
})
export class DynamicViewComponent implements OnInit, OnDestroy {
    bpmResponse: CoachDefinitionNodeDTO[] = [];
    formData: any = {};
    errorMessage: string | null = null;
    loading = false;
    id: string = '';
    versionId: string = '';
    private routeSub: Subscription | null = null;

    constructor(
        private processService: DynamicViewService,
        private route: ActivatedRoute,
        private router: Router,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe({
            next: (params) => {
                this.id = params['id'] || '';
                this.versionId = params['versionId'] || '';

                // Alternatively, if using query parameters:
                // this.route.queryParams.subscribe(queryParams => {
                //   this.id = queryParams['id'] || '';
                //   this.versionId = queryParams['versionId'] || '';
                // });

                if (this.id && this.versionId) {
                    this.loadCoachDefinitions();
                } else {
                    this.handleError('Missing required parameters: id and versionId');
                }
            },
            error: (err) => {
                this.handleError('Failed to parse route parameters', err);
            }
        });
    }

    ngOnDestroy() {
        if (this.routeSub) {
            this.routeSub.unsubscribe();
        }
    }

    loadCoachDefinitions() {
        if (!this.id || !this.versionId) {
            this.handleError('Cannot load data: missing id or versionId');
            return;
        }

        this.loading = true;
        this.errorMessage = null;

        this.processService.getInstanceDynamicView(this.id, this.versionId)
            .subscribe({
                next: (res) => {
                    this.bpmResponse = res || [];
                    this.loading = false;
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Form loaded successfully'
                    });
                },
                error: (err) => {
                    this.handleError('Failed to load form data', err);
                }
            });
    }

    private handleError(message: string, error?: any) {
        this.loading = false;
        this.errorMessage = message;

        console.error(message, error);

        this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: message,
            life: 5000
        });

        // Auto-redirect after error if no data is available
        if (this.bpmResponse.length === 0) {
            setTimeout(() => {
                this.router.navigate(['/']); // Redirect to home or error page
            }, 5000);
        }
    }

    onSubmit() {
        try {
            console.log('Form data to submit:', this.formData);

            // Validate form data before submission
            if (this.isFormValid()) {
                // TODO: send back to BPM if needed
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Form submitted successfully'
                });
            } else {
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Validation',
                    detail: 'Please fill all required fields'
                });
            }
        } catch (error) {
            this.handleError('Failed to submit form', error);
        }
    }

    private isFormValid(): boolean {
        // Implement your form validation logic here
        // This is a simple example - you might need more complex validation
        return Object.keys(this.formData).length > 0;
    }

    goBack() {
        this.router.navigate(['/']);
    }

    onButtonClick(event: any) {
        console.log('Button clicked:', event);
        this.messageService.add({
            severity: 'info',
            summary: 'Button Clicked',
            detail: `You clicked button: ${event.label || 'Unnamed'}`
        });
    }

}