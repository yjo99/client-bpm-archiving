import { Routes } from '@angular/router';
import { Documentation } from './documentation/documentation';
import { Crud } from './crud/crud';
import { Empty } from './empty/empty';
import {DatasourceConfig} from "./ConfigurationManagment/DatasourceConfig";
import {UserManagement} from "./user/UserManagement";
import {BpmServerFormComponent} from "./ConfigurationManagment/component/BpmServerFormComponent";
import {EcmServerFormComponent} from "./ConfigurationManagment/component/EcmServerFormComponent";
import {DbServerFormComponent} from "./ConfigurationManagment/component/DbServerFormComponent";
import {ProcessesManagement} from "./process/ProcessesManagement";
import {InstanceListManagement} from "./process/InastanceListManagment";
import {DynamicViewComponent} from "./process/DynamicViewComponent";
import {ProcessConfigurationComponent} from "./process/process-configuration.component";
import {ProcessSnapshotsComponent} from "./process/process-snapshots.component";
import {SuperAdminGuard} from "../core/guards/super-admin.guard";
import {ProcessInstancesComponent} from "./process/process.instances.component";


export default [
    { path: 'documentation', component: Documentation },
    { path: 'crud', component: Crud },
    {path: 'dataconfig', component: DatasourceConfig},
    {path: 'dataconfig/bpmform', component: BpmServerFormComponent},
    {path: 'dataconfig/ecmform', component: EcmServerFormComponent},
    {path: 'dataconfig/dbform', component: DbServerFormComponent},
    {path: "usermanagement", component: UserManagement},
    {path: "processmanagement", component: ProcessesManagement},
    {path: 'process/instance/:processId/instances', component: InstanceListManagement},
    {path: 'process/snapshots/:id', component: ProcessSnapshotsComponent},
    {path: 'process/instatnces', component: ProcessInstancesComponent},
    { path: 'process/instance-view/:id', component: DynamicViewComponent },
    {path: 'process/configure/:id', component: ProcessConfigurationComponent},
    { path: 'empty', component: Empty },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
