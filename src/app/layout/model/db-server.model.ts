import {BaseServerModel} from "./base-server.model";
import {DatabaseType} from "./DatabaseType";

export interface DbServerModel extends BaseServerModel {
    databaseType: DatabaseType;}