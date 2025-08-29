// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import {environment} from "../../../environments/environment";
import {JwtHelperService} from "@auth0/angular-jwt";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private tokenSubject = new BehaviorSubject<string | null>(null);
    public token$ = this.tokenSubject.asObservable();
    private bypassAuth = environment.bypassAuth;
    private jwtHelper = new JwtHelperService();


    constructor(private http: HttpClient, private router: Router) {
        if (!this.bypassAuth) {
            const storedToken = localStorage.getItem('authToken');
            if (storedToken) {
                this.tokenSubject.next(storedToken);
            }
        }
    }

    login(username: string, password: string): Observable<any> {
        if (this.bypassAuth) {
            // Return dummy success response when auth is bypassed
            return new Observable(subscriber => {
                subscriber.next({ token: 'bypassed-token' });
                subscriber.complete();
            });
        }

        return this.http.post<any>(`${environment.apiUrl}/api/auth/login`, { username, password }).pipe(
            tap(response => {
                if (response && response.accessToken) {
                      this.setToken(response.accessToken);  // store JWT
                }
            })
        );
    }

    logout(): void {
        if (!this.bypassAuth) {
            this.tokenSubject.next(null);
            localStorage.removeItem('authToken');
        }
        this.router.navigate(['auth/login']);
    }

    getToken(): string | null {
        return this.bypassAuth ? 'bypassed-token' : this.tokenSubject.value;
    }

    isAuthenticated(): boolean {
        console.log(this.bypassAuth)
        return this.bypassAuth || !!this.tokenSubject.value;
    }

    private setToken(token: string): void {
        if (!this.bypassAuth) {
            this.tokenSubject.next(token);
            localStorage.setItem('authToken', token);
        }
    }

    clearToken(): void {
      localStorage.removeItem('token');  // or however you store it
      this.tokenSubject.next(null);      // reset BehaviorSubject
    }

    getDecodedToken(): any {
        const token = this.getToken();
        if (!token) return null;

        try {
            return this.jwtHelper.decodeToken(token);
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    }

    getUserRoles(): string[] {
        const decodedToken = this.getDecodedToken();
        if (!decodedToken || !decodedToken.roles) return [];

        // Handle both string and array roles
        if (Array.isArray(decodedToken.roles)) {
            return decodedToken.roles;
        } else if (typeof decodedToken.roles === 'string') {
            return [decodedToken.roles];
        }

        return [];
    }

    hasRole(role: string): boolean {
        const roles = this.getUserRoles();
        return roles.includes(role);
    }

    isSuperAdmin(): boolean {
        return this.hasRole('SUPER_ADMIN');
    }

    isTokenExpired(): boolean {
        const token = this.getToken();
        if (!token) return true;

        return this.jwtHelper.isTokenExpired(token);
    }
}