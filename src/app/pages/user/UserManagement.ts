// user-management.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {Router, RouterModule} from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import {ConfirmationService, MessageService} from 'primeng/api';
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
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {catchError, concatMap, finalize, forkJoin, from, of} from "rxjs";
import {map} from "rxjs/operators";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import {AuthService} from "../../core/services/auth.service";

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
        AppFloatingConfigurator,
        ProgressSpinnerModule,
        ConfirmDialogModule,
    ],
    templateUrl: './userManagement.html',
    providers: [MessageService, ConfirmationService],
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
    passwordErrors: string[] = [];
    emailError: string = '';
    userGroupsLoading: boolean = false;
    userGroups: Group[] = [];

    onPageSizeChange(): void {
        localStorage.setItem('userManagementPageSize', this.pageSize.toString());
    }

    constructor(
        private superAdminService: SuperAdminService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private authService: AuthService,
        private router: Router
    ) {}

    ngOnInit(): void {
        // Check if user has SUPER_ADMIN role
        if (!this.authService.isSuperAdmin()) {
            this.messageService.add({
                severity: 'error',
                summary: 'Access Denied',
                detail: 'You require SUPER_ADMIN privileges to access this page',
                life: 5000
            });
            this.router.navigate(['/auth/login']);
            return;
        }
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

    // Add this method to load user groups
    loadUserGroups(username: string): void {
        if (!username) return;

        this.userGroupsLoading = true;
        this.superAdminService.getUserGroups(username).subscribe({
            next: (groups: Group[]) => {
                console.log("groups of user ")
                console.log(groups)
                this.userGroups = groups;
                this.userGroupsLoading = false;
            },
            error: (error: any) => {
                console.error('Error loading user groups:', error);
                this.userGroupsLoading = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load user groups'
                });
            }
        });
    }
    // Add this method to remove user from group
    removingFromGroup: boolean = false;

    removeUserFromGroup(group: Group): void {
        if (!this.selectedUser?.username || !group.name) return;

        const username = this.selectedUser.username;
        const groupName = group.name;

        this.confirmationService.confirm({
            message: `Remove user <strong>"${username}"</strong> from group <strong>"${groupName}"</strong>?`,
            header: 'Confirm Removal',
            icon: 'pi pi-users',
            acceptButtonStyleClass: 'p-button-warning',
            rejectButtonStyleClass: 'p-button-text p-button-plain',
            acceptIcon: 'pi pi-user-minus',
            rejectIcon: 'pi pi-times',
            defaultFocus: 'reject',

            accept: () => {
                this.executeRemoveFromGroup(groupName, username);
            },
            reject: () => {
                this.messageService.add({
                    severity: 'info',
                    summary: 'Cancelled',
                    detail: 'Removal cancelled',
                    life: 3000
                });
            }
        });
    }

    private executeRemoveFromGroup(groupName: string, username: string): void {
        this.removingFromGroup = true;

        this.superAdminService.removeUserFromGroup(groupName, username)
            .pipe(
                finalize(() => this.removingFromGroup = false)
            )
            .subscribe({
                next: (message) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Removed Successfully',
                        detail: message,
                        life: 5000,
                        icon: 'pi pi-check-circle'
                    });

                    this.loadUserGroups(username);
                    this.loadUsers();
                },
                error: (error) => {
                    console.error('Error removing user from group:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Removal Failed',
                        detail: error.message,
                        life: 7000,
                        icon: 'pi pi-exclamation-circle'
                    });
                }
            });
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
        this.passwordErrors = [];
        this.emailError = '';

        // Basic validation
        if (!this.userForm.username || !this.userForm.password || !this.userForm.email) {
            if (!this.userForm.email) {
                this.emailError = 'Email is required';
            }
            return;
        }

        // Email validation
        if (!this.isValidEmail(this.userForm.email)) {
            this.emailError = 'Please enter a valid email address';
            return;
        }

        // Password validation
        const passwordValidation = this.validatePassword(this.userForm.password);
        if (!passwordValidation.isValid) {
            this.passwordErrors = passwordValidation.errors;
            return;
        }

        this.superAdminService.createUser(this.userForm).subscribe({
            next: (response: string) => {
                // Handle string response from backend
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: response // Use the message from backend
                });
                this.userDialog = false;
                this.loadUsers();
                this.resetForm();
            },
            error: (error: any) => {
                console.error('Error creating user:', error);

                // Handle different error response formats
                let errorMessage = 'Failed to create user';

                if (typeof error.error === 'string') {
                    // Backend returned a string error message
                    errorMessage = error.error;
                } else if (error.error && error.error.message) {
                    // Backend returned JSON with message property
                    errorMessage = error.error.message;
                } else if (error.message) {
                    // HTTP error message
                    errorMessage = error.message;
                }

                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: errorMessage
                });
            }
        });
    }

// Password validation method
    validatePassword(password: string): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];

        if (password.length < 8) {
            errors.push('Password must be at least 8 characters long');
        }

        if (!/(?=.*[a-z])/.test(password)) {
            errors.push('Password must contain at least one lowercase letter');
        }

        if (!/(?=.*[A-Z])/.test(password)) {
            errors.push('Password must contain at least one uppercase letter');
        }

        if (!/(?=.*\d)/.test(password)) {
            errors.push('Password must contain at least one number');
        }

        if (!/(?=.*[@$!%*?&])/.test(password)) {
            errors.push('Password must contain at least one special character (@$!%*?&)');
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

// Email validation method
    isValidEmail(email: string): boolean {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }

// Reset form method
    resetForm(): void {
        this.userForm = {
            username: '',
            password: '',
            firstName: '',
            lastName: '',
            email: ''
        };
        this.submitted = false;
        this.passwordErrors = [];
        this.emailError = '';
    }

// Optional: Real-time password validation
    onPasswordInput(): void {
        if (this.userForm.password) {
            const validation = this.validatePassword(this.userForm.password);
            this.passwordErrors = validation.errors;
        } else {
            this.passwordErrors = [];
        }
    }

// Optional: Real-time email validation
    onEmailInput(): void {
        if (this.userForm.email) {
            this.emailError = this.isValidEmail(this.userForm.email) ? '' : 'Please enter a valid email address';
        } else {
            this.emailError = '';
        }
    }

    // Add this property to track delete operation
    deletingUser: boolean = false;

    deleteUser(user: User): void {
        if (!user.username) return;

        const username = user.username;

        this.confirmationService.confirm({
            message: `Are you sure you want to delete user <strong>"${username}"</strong>?`,
            header: 'Confirm User Deletion',
            icon: 'pi pi-exclamation-triangle',
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button-text p-button-plain',
            acceptIcon: 'pi pi-trash',
            rejectIcon: 'pi pi-times',
            defaultFocus: 'reject',

            accept: () => {
                // User clicked Yes
                this.executeUserDeletion(user);
            },
            reject: () => {
                // User clicked No
                this.messageService.add({
                    severity: 'info',
                    summary: 'Cancelled',
                    detail: 'User deletion cancelled',
                    life: 3000
                });
            }
        });
    }
    deletingUsers: Set<string> = new Set();

    private executeUserDeletion(user: User): void {
        const username = user.username!;
        this.deletingUsers.add(username);

        this.superAdminService.deleteUser(username)
            .pipe(
                finalize(() => this.deletingUsers.delete(username))
            )
            .subscribe({
                next: (message) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'User Deleted',
                        detail: message,
                        life: 5000,
                        icon: 'pi pi-check-circle'
                    });

                    this.loadUsers();

                    if (this.selectedUser?.username === username) {
                        this.selectedUser = null;
                        this.userGroups = [];
                    }
                },
                error: (error) => {
                    console.error('Error deleting user:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Delete Failed',
                        detail: error.message,
                        life: 7000,
                        icon: 'pi pi-exclamation-circle'
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

// Add these properties to track group operations
    creatingGroup: boolean = false;
    deletingGroups: Set<string> = new Set();

    createGroup(): void {
        this.groupSubmitted = true;

        if (!this.groupForm.name) {
            return;
        }

        this.creatingGroup = true;

        this.superAdminService.createGroup(this.groupForm)
            .pipe(
                finalize(() => this.creatingGroup = false)
            )
            .subscribe({
                next: (message) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Group Created',
                        detail: message,
                        life: 5000,
                        icon: 'pi pi-check-circle'
                    });
                    this.groupDialog = false;
                    this.loadGroups();
                },
                error: (error) => {
                    console.error('Error creating group:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Create Failed',
                        detail: error.message,
                        life: 7000,
                        icon: 'pi pi-exclamation-circle'
                    });
                }
            });
    }

    deleteGroup(group: Group): void {
        if (!group.name) return;

        const groupName = group.name;

        this.confirmationService.confirm({
            message: `Are you sure you want to delete group <strong>"${groupName}"</strong>?`,
            header: 'Confirm Group Deletion',
            icon: 'pi pi-exclamation-triangle',
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button-text',
            accept: () => {
                this.executeGroupDeletion(group);
            },
            reject: () => {
                this.messageService.add({
                    severity: 'info',
                    summary: 'Cancelled',
                    detail: 'Group deletion cancelled',
                    life: 3000
                });
            }
        });
    }

    private executeGroupDeletion(group: Group): void {
        const groupName = group.name!;
        this.deletingGroups.add(groupName);

        this.superAdminService.deleteGroup(groupName)
            .pipe(
                finalize(() => this.deletingGroups.delete(groupName))
            )
            .subscribe({
                next: (message) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Group Deleted',
                        detail: message,
                        life: 5000,
                        icon: 'pi pi-check-circle'
                    });
                    this.loadGroups();

                    // Clear selection if the deleted group was selected
                    if (this.selectedGroup?.name === groupName) {
                        this.selectedGroup = null;
                    }
                },
                error: (error) => {
                    console.error('Error deleting group:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Delete Failed',
                        detail: error.message,
                        life: 7000,
                        icon: 'pi pi-exclamation-circle'
                    });
                }
            });
    }

// Helper method to check if a group is being deleted
    isGroupBeingDeleted(group: Group): boolean {
        return group.name ? this.deletingGroups.has(group.name) : false;
    }

    // Assignment Methods
    openAssignmentDialog(user: User): void {
        this.selectedUser = user;
        this.selectedGroupsForAssignment = [];
        this.assignmentDialog = true;
    }

    // Update the assignGroupsToUser method to refresh groups after assignment
    assignGroupsToUserSequentially(): void {
        if (!this.selectedUser?.username || this.selectedGroupsForAssignment.length === 0) {
            return;
        }

        this.loading = true;
        const results: any[] = [];

        from(this.selectedGroupsForAssignment).pipe(
            concatMap(group =>
                this.superAdminService.assignUserToGroup(group.name!, this.selectedUser!.username!)
                    .pipe(
                        map(message => ({
                            success: true,
                            group: group.name,
                            message: message
                        })),
                        catchError(error => of({
                            success: false,
                            group: group.name,
                            message: error.message
                        }))
                    )
            ),
            finalize(() => {
                this.loading = false;
                this.processAssignmentResults(results);
            })
        ).subscribe(result => {
            results.push(result);
        });
    }

    private processAssignmentResults(results: any[]): void {
        const successful = results.filter(r => r.success);
        const failed = results.filter(r => !r.success);

        if (successful.length > 0) {
            this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: `User assigned to ${successful.length} group(s) successfully`
            });
        }

        failed.forEach(failure => {
            this.messageService.add({
                severity: 'warn',
                summary: `Failed to assign to ${failure.group}`,
                detail: failure.message
            });
        });

        if (successful.length > 0) {
            this.assignmentDialog = false;
            this.loadUserGroups(this.selectedUser!.username);
            this.loadUsers();
        }
    }

    onUserSelect(event: any): void {
        const userData = event && event.data ? event.data : event;

        if (userData && typeof userData === 'object' && 'username' in userData) {
            this.selectedUser = userData;
            this.loadUserGroups(userData.username); // Load groups for selected user
        } else {
            this.selectedUser = null;
            this.userGroups = []; // Clear groups when no user is selected
        }
    }
    refreshUserGroups(): void {
        if (this.selectedUser?.username) {
            this.loadUserGroups(this.selectedUser.username);
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

    // Add these properties to your component
    passwordUpdateDialog: boolean = false;
    passwordUpdateUser: User | null = null;
    newPassword: string = '';
    confirmPassword: string = '';
    updatingPassword: boolean = false;
    passwordUpdateErrors: string[] = [];

// Add this method to open password update dialog
    openPasswordUpdateDialog(user: User): void {
        this.passwordUpdateUser = user;
        this.newPassword = '';
        this.confirmPassword = '';
        this.passwordUpdateErrors = [];
        this.passwordUpdateDialog = true;
    }

// Add this method to update password
    updatePassword(): void {
        if (!this.passwordUpdateUser?.username) return;

        this.passwordUpdateErrors = [];

        // Validate passwords
        if (!this.newPassword) {
            this.passwordUpdateErrors.push('New password is required');
            return;
        }

        if (!this.confirmPassword) {
            this.passwordUpdateErrors.push('Please confirm your password');
            return;
        }

        if (this.newPassword !== this.confirmPassword) {
            this.passwordUpdateErrors.push('Passwords do not match');
            return;
        }

        // Validate password complexity
        const passwordValidation = this.validatePassword(this.newPassword);
        if (!passwordValidation.isValid) {
            this.passwordUpdateErrors = passwordValidation.errors;
            return;
        }

        this.updatingPassword = true;

        this.superAdminService.updateUserPassword(this.passwordUpdateUser.username, this.newPassword)
            .pipe(
                finalize(() => this.updatingPassword = false)
            )
            .subscribe({
                next: (message) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Password Updated',
                        detail: message,
                        life: 5000,
                        icon: 'pi pi-check-circle'
                    });
                    this.passwordUpdateDialog = false;
                    this.resetPasswordForm();
                },
                error: (error) => {
                    console.error('Error updating password:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Update Failed',
                        detail: error.message,
                        life: 7000,
                        icon: 'pi pi-exclamation-circle'
                    });
                }
            });
    }

// Add this method to reset password form
    resetPasswordForm(): void {
        this.newPassword = '';
        this.confirmPassword = '';
        this.passwordUpdateErrors = [];
    }

// Add this method to close password dialog
    closePasswordDialog(): void {
        this.passwordUpdateDialog = false;
        this.resetPasswordForm();
    }
}