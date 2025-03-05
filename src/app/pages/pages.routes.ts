import { Routes } from '@angular/router';
import { Documentation } from './documentation/documentation';
import { Crud } from './crud/crud';
import { Empty } from './empty/empty';
import {DatasourceConfig} from "./ConfigurationManagment/DatasourceConfig";
import {UserManagement} from "./user/UserManagement";
import {ProcessManagement} from "./process/ProcessManagement";

export default [
    { path: 'documentation', component: Documentation },
    { path: 'crud', component: Crud },
    {path: 'dataconfig', component: DatasourceConfig},
    {path: "usermanagement", component: UserManagement},
    {path: "processmanagement", component: ProcessManagement},
    { path: 'empty', component: Empty },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
