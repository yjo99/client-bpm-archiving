import { Component, Input, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EcmServerModel } from '../../../layout/model/ecm-server.model';
import { InputText } from 'primeng/inputtext';
import { NgClass, NgIf } from '@angular/common';
import { Button } from 'primeng/button';
import { Checkbox } from 'primeng/checkbox';

@Component({
    selector: 'app-ecm-server-form',
    templateUrl: './ecm-server-form-component.html',
    imports: [
        InputText,
        NgClass,
        NgIf,
        Button,
        Checkbox,
        ReactiveFormsModule
    ]
})
export class EcmServerFormComponent implements OnInit {
    form: FormGroup;
    isEditMode = false;
    @Input() server: EcmServerModel | null = null;
    testMessage: string | null = null;
    testSuccess = false;

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.form = this.fb.group({
            serverName: ['', Validators.required],
            serverHostName: ['', Validators.required],
            serverPort: ['', [Validators.required, Validators.min(1), Validators.max(65535)]],
            userName: ['', Validators.required],
            userPassword: ['', Validators.required],
            MaximumParallelTransactoin: ['', [Validators.required, Validators.min(1)]],
            useSecureConnection: [false],
            contextPath: ['', Validators.required],
            RepositoryName: ['', Validators.required],
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
                        this.form.patchValue(this.server);
                    }
                } catch (error) {
                    console.error('Error parsing server data:', error);
                }
            }
        });
    }

    testConnection(): void {
        const isSuccessful = Math.random() > 0.5;
        this.testMessage = isSuccessful ? 'Connection Successful!' : 'Connection Failed!';
        this.testSuccess = isSuccessful;

        setTimeout(() => (this.testMessage = null), 3000);
    }

    onSubmit(): void {
        if (this.form.valid) {
            const formValue = this.form.value;
            const server: EcmServerModel = {
                id: this.server ? this.server.id : Date.now(),
                ...formValue
            };

            console.log('Server saved/updated:', server);
            this.router.navigate(['/pages/dataconfig']);
        }
    }
}
