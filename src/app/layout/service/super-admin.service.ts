// src/app/services/super-admin.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {catchError, Observable, tap, throwError} from 'rxjs';
import {environment} from "../../../environments/environment";
import {User} from "../model/user.model";
import {UserRequest} from "../model/user.request.model";
import {CreateGroupRequest} from "../model/create.group.model";
import {Group} from "../model/group.model";

@Injectable({
    providedIn: 'root'
})
export class SuperAdminService {
    private apiUrl = `${environment.apiUrl}/api/super-admin`;

    constructor(private http: HttpClient) { }

    getAllUsers(): Observable<User[]> {
        return this.http.get<User[]>(`${this.apiUrl}/users`);
    }

    getUser(username: string): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}/users/${username}`);
    }

    createUser(userRequest: UserRequest): Observable<any> {
        return this.http.post(`${this.apiUrl}/users`, userRequest, {
            responseType: 'text' // Handle response as text instead of JSON
        });
    }

    updateUserPassword(username: string, newPassword: string): Observable<any> {
        return this.http.put(`${this.apiUrl}/users/${username}/password`, newPassword, {
            headers: { 'Content-Type': 'text/plain' }
        });
    }

    deleteUser(username: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/users/${username}`);
    }

    getAllGroups(): Observable<Group[]> {
        return this.http.get<Group[]>(`${this.apiUrl}/groups`);
    }

    getUsersInGroup(groupName: string): Observable<User[]> {
        return this.http.get<User[]>(`${this.apiUrl}/groups/${groupName}/users`);
    }

    getUserGroups(username: string): Observable<Group[]> {
        return this.http.get<Group[]>(`${this.apiUrl}/users/${username}/groups`);
    }

    createGroup(groupRequest: CreateGroupRequest): Observable<any> {
        return this.http.post(`${this.apiUrl}/groups`, groupRequest);
    }

    deleteGroup(groupName: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/groups/${groupName}`);
    }

    assignUserToGroup(groupName: string, username: string): Observable<any> {
        console.log('Sending request to assign user', username, 'to group', groupName);
        const url = `${this.apiUrl}/groups/${groupName}/users/${username}`;
        console.log('Request URL:', url);

        return this.http.post(url, null, {
            observe: 'response' // Get full response for debugging
        }).pipe(
            tap(response => {
                console.log('Response received:', response.status, response.body);
            }),
            catchError(error => {
                console.error('Error in assignUserToGroup:', error);
                return throwError(() => error);
            })
        );
    }

    removeUserFromGroup(groupName: string, username: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/groups/${groupName}/users/${username}`);
    }

    // Bulk Operations

    createUsersBulk(userRequests: UserRequest[]): Observable<any> {
        return this.http.post(`${this.apiUrl}/bulk/users`, userRequests);
    }

    createGroupsBulk(groupRequests: CreateGroupRequest[]): Observable<any> {
        return this.http.post(`${this.apiUrl}/bulk/groups`, groupRequests);
    }


    checkUserExists(username: string): Observable<boolean> {
        // You might need to implement this based on your backend API
        // or handle it in the component by catching 404 errors
        return new Observable(observer => {
            this.getUser(username).subscribe({
                next: () => observer.next(true),
                error: (error) => {
                    if (error.status === 404) {
                        observer.next(false);
                    } else {
                        observer.error(error);
                    }
                },
                complete: () => observer.complete()
            });
        });
    }

    checkGroupExists(groupName: string): Observable<boolean> {
        // Similar implementation for group existence check
        return new Observable(observer => {
            this.getUsersInGroup(groupName).subscribe({
                next: () => observer.next(true),
                error: (error) => {
                    if (error.status === 404) {
                        observer.next(false);
                    } else {
                        observer.error(error);
                    }
                },
                complete: () => observer.complete()
            });
        });
    }
}