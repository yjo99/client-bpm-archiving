import {BaseServerModel} from "./base-server.model";

export interface EcmServerModel extends BaseServerModel {
    contextPath: string;
    RepositoryName: string;
}