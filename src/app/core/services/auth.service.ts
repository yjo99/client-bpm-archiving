// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import {environment} from "../../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private tokenSubject = new BehaviorSubject<string | null>(null);
    public token$ = this.tokenSubject.asObservable();
    private bypassAuth = environment.bypassAuth;

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

        return this.http.post<any>(`${environment.apiUrl}/auth/login`, { username, password }).pipe(
            tap(response => {
                if (response.token) {
                    this.setToken(response.token);
                }
            })
        );
    }

    logout(): void {
        if (!this.bypassAuth) {
            this.tokenSubject.next(null);
            localStorage.removeItem('authToken');
        }
        this.router.navigate(['/login']);
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
}