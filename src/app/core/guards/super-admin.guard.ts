// guards/super-admin.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MessageService } from 'primeng/api';

@Injectable({
    providedIn: 'root'
})
export class SuperAdminGuard implements CanActivate {

    constructor(
        private authService: AuthService,
        private router: Router,
        private messageService: MessageService
    ) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean {
        if (this.authService.isSuperAdmin()) {
            return true;
        }

        // User doesn't have SUPER_ADMIN role
        this.messageService.add({
            severity: 'error',
            summary: 'Access Denied',
            detail: 'You require SUPER_ADMIN privileges to access this page',
            life: 5000
        });

        // Redirect to home or unauthorized page
        this.router.navigate(['/']);
        return false;
    }
}