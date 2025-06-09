import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {Router, RouterModule} from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import {AuthService} from "../../core/services/auth.service";
import {MessageService} from "primeng/api";
import { HttpClientModule } from '@angular/common/http';
import {ToastModule} from "primeng/toast";

// @ts-ignore
@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ButtonModule,
        CheckboxModule,
        InputTextModule,
        PasswordModule,
        FormsModule,
        RippleModule,
        AppFloatingConfigurator,
        HttpClientModule,
        ToastModule
    ],
    templateUrl: './login.html',
    providers: [MessageService]
})
export class Login {
    userName: string = '';
    password: string = '';
    loading: boolean = false;

    constructor(
        private authService: AuthService,
        private router: Router,
        private messageService: MessageService
    ) {}

    onSubmit(): void {
        if (!this.userName || !this.password) {
            this.messageService.add({
                severity: 'error',
                summary: 'Validation Error',
                detail: 'Please enter both username and password'
            });
            return;
        }

        this.loading = true;
        this.authService.login(this.userName, this.password).subscribe({
            next: (response) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Login Successful',
                    detail: 'Welcome back!'
                });
                this.router.navigate(['/']);
            },
            error: (error) => {
                this.loading = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Login Failed',
                    detail: error.error?.message || 'Invalid credentials'
                });
            },
            complete: () => {
                this.loading = false;
            }
        });
    }
}
