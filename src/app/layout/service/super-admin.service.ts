// src/app/services/super-admin.service.ts
import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {catchError, delay, Observable, tap, throwError} from 'rxjs';
import {environment} from "../../../environments/environment";
import {User} from "../model/user.model";
import {UserRequest} from "../model/user.request.model";
import {CreateGroupRequest} from "../model/create.group.model";
import {Group} from "../model/group.model";
import {map, retry} from "rxjs/operators";

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

    deleteUser(username: string): Observable<string> {
        console.log('Sending request to delete user:', username);
        const url = `${this.apiUrl}/users/${username}`;
        console.log('Request URL:', url);

        return this.http.delete(url, {
            responseType: 'text', // Expect text response
            observe: 'response'   // Get full response
        }).pipe(
            tap(response => {
                console.log('Response received:', response.status, response.body);
            }),
            map(response => {
                // For successful responses (200-299), return the success message
                if (response.status >= 200 && response.status < 300) {
                    return response.body || 'User deleted successfully';
                }
                // For error responses, throw an error with the message
                throw new Error(response.body || 'Unknown error occurred');
            }),
            catchError((error: HttpErrorResponse) => {
                console.error('Error in deleteUser:', error);

                let errorMessage = 'Failed to delete user';

                // Handle different error scenarios
                if (error.error && typeof error.error === 'string') {
                    // Backend returned a string error message
                    errorMessage = error.error;
                } else if (error.status === 0) {
                    // Network error
                    errorMessage = 'Network error: Unable to connect to server';
                } else if (error.status === 404) {
                    errorMessage = `User '${username}' not found`;
                } else if (error.status >= 400 && error.status < 500) {
                    // Client error
                    errorMessage = error.error || `Server error: ${error.status}`;
                } else if (error.status >= 500) {
                    // Server error
                    errorMessage = 'Server error: Please try again later';
                }

                return throwError(() => new Error(errorMessage));
            })
        );
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

    assignUserToGroup(groupName: string, username: string): Observable<string> {
        console.log('Sending request to assign user', username, 'to group', groupName);
        const url = `${this.apiUrl}/groups/${groupName}/users/${username}`;
        console.log('Request URL:', url);

        return this.http.post(url, null, {
            responseType: 'text', // Expect text response
            observe: 'response'   // Get full response
        }).pipe(
            tap(response => {
                console.log('Response received:', response.status, response.body);
            }),
            map(response => {
                // For successful responses (200-299), return the success message
                if (response.status >= 200 && response.status < 300) {
                    return response.body || 'User assigned to group successfully';
                }
                // For error responses, throw an error with the message
                throw new Error(response.body || 'Unknown error occurred');
            }),
            catchError((error: HttpErrorResponse) => {
                console.error('Error in assignUserToGroup:', error);

                let errorMessage = 'Failed to assign user to group';

                // Handle different error scenarios
                if (error.error && typeof error.error === 'string') {
                    // Backend returned a string error message
                    errorMessage = error.error;
                } else if (error.status === 0) {
                    // Network error
                    errorMessage = 'Network error: Unable to connect to server';
                } else if (error.status >= 400 && error.status < 500) {
                    // Client error (bad request, not found, etc.)
                    errorMessage = error.error || `Server error: ${error.status}`;
                } else if (error.status >= 500) {
                    // Server error
                    errorMessage = 'Server error: Please try again later';
                }

                return throwError(() => new Error(errorMessage));
            })
        );
    }

    assignUserToGroupWithRetry(groupName: string, username: string): Observable<string> {
        return this.http.post(`${this.apiUrl}/groups/${groupName}/users/${username}`, null, {
            responseType: 'text',
            observe: 'response'
        }).pipe(
            retry(2), // Retry up to 2 times on failure
            delay(1000), // Wait 1 second between retries
            map(response => {
                if (response.status >= 200 && response.status < 300) {
                    return response.body || 'Success';
                }
                throw new Error(response.body || 'Unknown error');
            }),
            catchError((error: HttpErrorResponse) => {
                // Enhanced error handling
                let errorMessage = 'Failed to assign user to group';

                if (error.error && typeof error.error === 'string') {
                    errorMessage = error.error;
                } else if (error.status === 404) {
                    errorMessage = 'Resource not found';
                } else if (error.status === 400) {
                    errorMessage = 'Bad request - check user and group names';
                }

                return throwError(() => new Error(errorMessage));
            })
        );
    }

    removeUserFromGroup(groupName: string, username: string): Observable<string> {
        console.log('Sending request to remove user', username, 'from group', groupName);
        const url = `${this.apiUrl}/groups/${groupName}/users/${username}`;
        console.log('Request URL:', url);

        return this.http.delete(url, {
            responseType: 'text', // Expect text response
            observe: 'response'   // Get full response
        }).pipe(
            tap(response => {
                console.log('Response received:', response.status, response.body);
            }),
            map(response => {
                // For successful responses (200-299), return the success message
                if (response.status >= 200 && response.status < 300) {
                    return response.body || 'User removed from group successfully';
                }
                // For error responses, throw an error with the message
                throw new Error(response.body || 'Unknown error occurred');
            }),
            catchError((error: HttpErrorResponse) => {
                console.error('Error in removeUserFromGroup:', error);

                let errorMessage = 'Failed to remove user from group';

                // Handle different error scenarios
                if (error.error && typeof error.error === 'string') {
                    // Backend returned a string error message
                    errorMessage = error.error;
                } else if (error.status === 0) {
                    // Network error
                    errorMessage = 'Network error: Unable to connect to server';
                } else if (error.status >= 400 && error.status < 500) {
                    // Client error (bad request, not found, etc.)
                    errorMessage = error.error || `Server error: ${error.status}`;
                } else if (error.status >= 500) {
                    // Server error
                    errorMessage = 'Server error: Please try again later';
                }

                return throwError(() => new Error(errorMessage));
            })
        );
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