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
import { AccordionModule } from 'primeng/accordion';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import {Group} from "../../layout/model/group.model";
import {CreateGroupRequest} from "../../layout/model/create.group.model";
import {UserRequest} from "../../layout/model/user.request.model";
import {User} from "../../layout/model/user.model";
import {SuperAdminService} from "../../layout/service/super-admin.service";

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
        AccordionModule,
        InputGroupModule,
        InputGroupAddonModule,
        AppFloatingConfigurator
    ],
    templateUrl: './userManagement.html',
    providers: [MessageService]
})
export class UserManagement implements OnInit {
    // Users
    users: User[] = [];
    filteredUsers: User[] = [];
    selectedUser: User | null = null;
    userDialog: boolean = false;
    userForm: UserRequest = {
        username: '',
        password: '',
        firstName: '',
        lastName: '',
        email: ''
    };

    // Groups
    groups: Group[] = [];
    filteredGroups: Group[] = [];
    selectedGroup: Group | null = null;
    groupDialog: boolean = false;
    groupForm: CreateGroupRequest = {
        name: ''
    };

    // Assignment
    assignmentDialog: boolean = false;
    selectedGroupsForAssignment: Group[] = [];

    // Search
    userSearchText: string = '';
    groupSearchText: string = '';

    // UI State
    loading: boolean = false;
    activeIndex: number = 0;
    submitted: boolean = false;
    groupSubmitted: boolean = false;

    pageSize: number = 10;


    onPageSizeChange(): void {
        // This will trigger the table to update with new page size
        // You might want to save this preference to local storage
        localStorage.setItem('userManagementPageSize', this.pageSize.toString());
    }

    constructor(
        private superAdminService: SuperAdminService,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        this.loadUsers();
        this.loadGroups();

        // Load saved page size
        const savedPageSize = localStorage.getItem('userManagementPageSize');
        if (savedPageSize) {
            this.pageSize = parseInt(savedPageSize, 10);
        }
    }

    // User Methods
    loadUsers(): void {
        this.loading = true;
        this.superAdminService.getAllUsers().subscribe({
            next: (users: any) => {
                this.users = users;
                this.filteredUsers = users;
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

    filterUsers(): void {
        if (!this.userSearchText) {
            this.filteredUsers = this.users;
            return;
        }

        const searchText = this.userSearchText.toLowerCase();
        this.filteredUsers = this.users.filter(user =>
            user.username?.toLowerCase().includes(searchText) ||
            user.firstName?.toLowerCase().includes(searchText) ||
            user.lastName?.toLowerCase().includes(searchText) ||
            user.email?.toLowerCase().includes(searchText)
        );
    }

    clearUserSearch(): void {
        this.userSearchText = '';
        this.filterUsers();
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
                this.filteredGroups = groups;
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

    filterGroups(): void {
        if (!this.groupSearchText) {
            this.filteredGroups = this.groups;
            return;
        }

        const searchText = this.groupSearchText.toLowerCase();
        this.filteredGroups = this.groups.filter(group =>
            group.name?.toLowerCase().includes(searchText)
        );
    }

    clearGroupSearch(): void {
        this.groupSearchText = '';
        this.filterGroups();
    }

    openNewGroup(): void {
        this.groupForm = { name: '' };
        this.groupSubmitted = false;
        this.groupDialog = true;
    }

    createGroup(): void {
        this.groupSubmitted = true;

        if (!this.groupForm.name) {
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
        this.selectedUser = user;
        this.selectedGroupsForAssignment = [];
        this.assignmentDialog = true;
    }

    assignGroupsToUser(): void {
        if (!this.selectedUser?.username || this.selectedGroupsForAssignment.length === 0) {
            return;
        }

        const assignments = this.selectedGroupsForAssignment.map(group =>
            this.superAdminService.assignUserToGroup(group.name!, this.selectedUser!.username!)
        );

        Promise.all(assignments).then(() => {
            this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'User assigned to groups successfully'
            });
            this.assignmentDialog = false;
            this.loadUsers(); // Refresh to show updated groups
        }).catch(error => {
            console.error('Error assigning groups:', error);
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to assign groups: ' + error.message
            });
        });
    }

    onUserSelect(event: any): void {
        // Use a different variable name to avoid conflict with User type
        const userData = event && event.data ? event.data : event;

        if (userData && typeof userData === 'object' && 'username' in userData) {
            this.selectedUser = userData;
        } else {
            this.selectedUser = null;
        }
    }

    onGroupSelect(event: any): void {
        // Rename the variable from 'group' to something else like 'selectedGroup'
        const selectedGroup = event && event.data ? event.data : event;

        if (selectedGroup && typeof selectedGroup === 'object' && 'name' in selectedGroup) {
            this.selectedGroup = selectedGroup;
        } else {
            this.selectedGroup = null;
        }
    }

    // Add this method to your component
    removeGroupFromSelection(group: Group): void {
        this.selectedGroupsForAssignment = this.selectedGroupsForAssignment.filter(
            g => g.name !== group.name
        );
    }
}