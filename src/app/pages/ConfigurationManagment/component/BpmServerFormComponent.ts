import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {BpmServerModel} from "../../../layout/model/bpm-server.model";
import {InputText} from "primeng/inputtext";
import {NgClass, NgIf} from "@angular/common";
import {Button} from "primeng/button";
import {Checkbox} from "primeng/checkbox"; // Import ActivatedRoute and Router

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
    ]
})
export class BpmServerFormComponent implements OnInit {
    form: FormGroup;
    isEditMode = false;
    // server: BpmServerModel | null = null;
    @Input() server: BpmServerModel | null = null;
    testMessage: string | null = null;
    testSuccess: boolean = false;

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute, // Inject ActivatedRoute
        private router: Router // Inject Router
    ) {
        this.form = this.fb.group({
            serverName: ['', Validators.required],
            serverHostName: ['', Validators.required],
            serverPort: ['', [Validators.required, Validators.min(1), Validators.max(65535)]],
            userName: ['', Validators.required],
            userPassword: ['', Validators.required],
            MaximumParallelTransactoin: ['', [Validators.required, Validators.min(1)]],
            useSecureConnection: [false],
        });
    }

    ngOnInit(): void {
        console.log("Hello");
        this.route.queryParams.subscribe((params) => {
            console.log("params" + params['server']);
            if (params['server']) {
                try {
                    const parsedServer: BpmServerModel = JSON.parse(params['server']);
                    console.log("parsedServer: " + parsedServer);
                    if (parsedServer) {
                        this.server = parsedServer;
                        this.isEditMode = true;
                        this.form.patchValue(this.server); // Patch form values if in edit mode
                    }
                } catch (error) {
                    console.error('Error parsing server data:', error);
                }
            }
        });
        console.log("server : " + this.server);

        // if (this.server) {
        //     this.isEditMode = true;
        //     this.form.patchValue(this.server);
        // }
    }

    testConnection(): void {
        // Simulating API call
        const isSuccessful = Math.random() > 0.5; // Randomly pass/fail for testing

        if (isSuccessful) {
            this.testMessage = 'Connection Successful!';
            this.testSuccess = true;
        } else {
            this.testMessage = 'Connection Failed!';
            this.testSuccess = false;
        }

        // Hide the message after 3 seconds
        setTimeout(() => (this.testMessage = null), 3000);
    }

    onSubmit(): void {
        if (this.form.valid) {
            const formValue = this.form.value;
            const server: BpmServerModel = {
                id: this.server ? this.server.id : Date.now(), // Use existing ID or generate a new one
                ...formValue,
            };

            // Save or update the server (you can emit an event or call a service here)
            console.log('Server saved/updated:', server);

            // Navigate back to the list screen
            this.router.navigate(['/pages/dataconfig']);
        }
    }
}