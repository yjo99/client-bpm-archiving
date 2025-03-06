import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { BpmServerModel } from '../../../layout/model/bpm-server.model';
import {NgClass, NgIf} from "@angular/common";
import {Checkbox} from "primeng/checkbox";
import {Button} from "primeng/button";

@Component({
    selector: 'app-bpm-server-form',
    templateUrl: './bpm-server-form.component.html',
    imports: [
        NgClass,
        Checkbox,
        ReactiveFormsModule,
        NgIf,
        Button
    ]
})
export class BpmServerFormComponent implements OnInit {
    @Input() server: BpmServerModel | null = null;
    @Output() save = new EventEmitter<BpmServerModel>();

    form: FormGroup;
    isEditMode = false;
    testMessage: string | null = null;
    testSuccess: boolean = false;

    constructor(private fb: FormBuilder) {
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
        if (this.server) {
            this.isEditMode = true;
            this.form.patchValue(this.server);
        }
    }

    onSubmit(): void {
        if (this.form.valid) {
            const server: BpmServerModel = {
                id: this.server ? this.server.id : Date.now(),
                ...this.form.value,
            };
            this.save.emit(server);
        }
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
}
