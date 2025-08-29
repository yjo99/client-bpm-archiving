import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})
export class AppMenu implements OnInit {
    model: MenuItem[] = [];

    ngOnInit() {
        this.buildMenu();
    }

    private buildMenu() {
        this.model = [
            {
                label: 'Home',
                items: [{ label: 'Home', icon: 'pi pi-fw pi-home', routerLink: ['/'] }]
            },
            {
                label: 'Configuration',
                items: [{ label: 'Datasource Management', icon: 'pi pi-fw pi-cog', routerLink: ['/pages/dataconfig'] }]
            },
            // Conditionally add User menu section
            ...this.getUserMenuSection(),
            {
                label: 'Process',
                items: [{ label: 'Process Management', icon: 'pi pi-fw pi-share-alt', routerLink: ['/pages/processmanagement'] }]
            },
            {
                label: 'System',
                items: [{ label: 'System Dashboard', icon: 'pi pi-fw pi-tablet', routerLink: ['/pages/empty'] }]
            }
        ];
    }

    private getUserMenuSection(): MenuItem[] {
        // Check if user has SUPER_ADMIN role
        if (this.isSuperAdmin()) {
            return [
                {
                    label: 'User',
                    items: [{
                        label: 'Users Management',
                        icon: 'pi pi-fw pi-users',
                        routerLink: ['/pages/usermanagement']
                    }]
                }
            ];
        }
        return [];
    }

    private isSuperAdmin(): boolean {
        // Get token from localStorage
        const token = localStorage.getItem('authToken');
        console.log("token is")
        console.log(token)
        if (!token) return false;

        try {
            // Decode JWT token to check roles
            const payload = this.decodeJwtToken(token);
            const roles = this.extractRolesFromPayload(payload);
            // Check if SUPER_ADMIN role exists
            return roles.includes('SUPER_ADMIN');
        } catch (error) {
            console.error('Error checking user role:', error);
            return false;
        }
    }

    private decodeJwtToken(token: string): any {
        try {
            // JWT tokens are in format: header.payload.signature
            const payloadBase64 = token.split('.')[1];
            // Base64 decode and parse JSON
            const payloadJson = atob(payloadBase64);
            return JSON.parse(payloadJson);
        } catch (error) {
            console.error('Error decoding JWT token:', error);
            return null;
        }
    }

    private extractRolesFromPayload(payload: any): string[] {
        if (!payload) return [];

        // Handle different possible role claim names
        const roles = payload.roles || payload.role || payload.authorities || payload.scope || [];

        // Normalize to array of strings
        if (Array.isArray(roles)) {
            return roles.map(role => role.toUpperCase());
        } else if (typeof roles === 'string') {
            return [roles.toUpperCase()];
        }

        return [];
    }
}