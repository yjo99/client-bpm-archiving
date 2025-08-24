import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import {AuthService} from "../../core/services/auth.service";
import {jwtDecode} from "jwt-decode";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ButtonModule,
    CheckboxModule,
    InputTextModule,
    PasswordModule,
    FormsModule,
    RouterModule,
    RippleModule,
    AppFloatingConfigurator
  ],
  templateUrl: './home.html'
})
export class Home implements OnInit {
  username: string = '';
  constructor(private authService: AuthService) {}

    ngOnInit(): void {
        const token = this.authService.getToken();
        if (token) {
            try {
                const decoded: any = jwtDecode(token);
                this.username = decoded.sub;
            } catch (e) {
                console.error('Invalid token', e);
            }
        }
    }
}
