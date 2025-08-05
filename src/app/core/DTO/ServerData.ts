export interface ServerData {
    ID?: number;
    serverName: string;
    serverCode: string;
    serverHostName: string;
    contextPath: string;
    repositoryName: string;
    databaseType: string;
    serverPort: string;
    userName: string;
    userPassword: string;
    maximumParallelTransaction: string;
    useSecureConnection: number;
}