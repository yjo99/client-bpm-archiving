import {BaseServerModel} from "./base-server.model";

export interface DbServerModel extends BaseServerModel {
    databaseType: string;
}