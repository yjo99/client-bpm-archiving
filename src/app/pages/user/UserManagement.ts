// user-management.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import {User} from "../../layout/model/user.model";
import {CreateGroupRequest} from "../../layout/model/create.group.model";
import {SuperAdminService} from "../../layout/service/super-admin.service";
import {Group} from "../../layout/model/group.model";
import {UserRequest} from "../../layout/model/user.request.model";

@Component({
    selector: 'app-user-management',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        ButtonModule,
        CheckboxModule,
        InputTextModule,
        PasswordModule,
        RippleModule,
        TableModule,
        DialogModule,
        DropdownModule,
        MultiSelectModule,
        ToastModule,
        TagModule,
        ToolbarModule,
        AppFloatingConfigurator
    ],
    templateUrl: './userManagement.html',
    providers: [MessageService]
})
export class UserManagement implements OnInit {
    // Users
    users: User[] = [];
    selectedUsers: User[] = [];
    userDialog: boolean = false;
    user: User = {} as User;
    submitted: boolean = false;

    // Groups
    groups: Group[] = [];
    selectedGroups: Group[] = [];
    groupDialog: boolean = false;
    group: Group = {} as Group;
    groupSubmitted: boolean = false;

    // User Form
    userForm: UserRequest = {
        username: '',
        password: '',
        firstName: '',
        lastName: '',
        email: ''
    };

    // Group Form
    groupForm: CreateGroupRequest = {
        groupName: ''
    };

    // Assignment
    assignmentDialog: boolean = false;
    selectedUserForAssignment: User | null = null;
    selectedGroupsForAssignment: Group[] = [];

    loading: boolean = false;

    constructor(
        private superAdminService: SuperAdminService,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        this.loadUsers();
        this.loadGroups();
    }

    // User Methods
    loadUsers(): void {
        this.loading = true;
        this.superAdminService.getAllUsers().subscribe({
            next: (users: any) => {
                this.users = users;
                this.loading = false;
            },
            error: (error: any) => {
                console.error('Error loading users:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load users'
                });
                this.loading = false;
            }
        });
    }

    openNewUser(): void {
        this.userForm = {
            username: '',
            password: '',
            firstName: '',
            lastName: '',
            email: ''
        };
        this.submitted = false;
        this.userDialog = true;
    }

    createUser(): void {
        this.submitted = true;

        if (!this.userForm.username || !this.userForm.password) {
            return;
        }

        this.superAdminService.createUser(this.userForm).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'User created successfully'
                });
                this.userDialog = false;
                this.loadUsers();
            },
            error: (error: any) => {
                console.error('Error creating user:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to create user: ' + error.message
                });
            }
        });
    }

    deleteUser(user: User): void {
        if (!user.username) return;

        this.superAdminService.deleteUser(user.username).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'User deleted successfully'
                });
                this.loadUsers();
            },
            error: (error: any) => {
                console.error('Error deleting user:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to delete user: ' + error.message
                });
            }
        });
    }

    // Group Methods
    loadGroups(): void {
        this.loading = true;
        this.superAdminService.getAllGroups().subscribe({
            next: (groups: any) => {
                this.groups = groups;
                this.loading = false;
            },
            error: (error: any) => {
                console.error('Error loading groups:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load groups'
                });
                this.loading = false;
            }
        });
    }

    openNewGroup(): void {
        this.groupForm = { groupName: '' };
        this.groupSubmitted = false;
        this.groupDialog = true;
    }

    createGroup(): void {
        this.groupSubmitted = true;

        if (!this.groupForm.groupName) {
            return;
        }

        this.superAdminService.createGroup(this.groupForm).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Group created successfully'
                });
                this.groupDialog = false;
                this.loadGroups();
            },
            error: (error: any) => {
                console.error('Error creating group:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to create group: ' + error.message
                });
            }
        });
    }

    deleteGroup(group: Group): void {
        if (!group.name) return;

        this.superAdminService.deleteGroup(group.name).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Group deleted successfully'
                });
                this.loadGroups();
            },
            error: (error: any) => {
                console.error('Error deleting group:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to delete group: ' + error.message
                });
            }
        });
    }

    // Assignment Methods
    openAssignmentDialog(user: User): void {
        this.selectedUserForAssignment = user;
        this.selectedGroupsForAssignment = [];
        this.assignmentDialog = true;
    }

    assignGroupsToUser(): void {
        if (!this.selectedUserForAssignment?.username || this.selectedGroupsForAssignment.length === 0) {
            return;
        }

        const assignments = this.selectedGroupsForAssignment.map(group =>
            this.superAdminService.assignUserToGroup(group.name!, this.selectedUserForAssignment!.username!)
        );

        Promise.all(assignments).then(() => {
            this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'User assigned to groups successfully'
            });
            this.assignmentDialog = false;
        }).catch(error => {
            console.error('Error assigning groups:', error);
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to assign groups: ' + error.message
            });
        });
    }

    // // Helper Methods
    // getUserGroups(user: User): string {
    //     // This would need to be implemented based on your data structure
    //     return user.groups?.map(g => g.name).join(', ') || 'No groups';
    // }
}