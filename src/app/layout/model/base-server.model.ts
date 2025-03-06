export interface BaseServerModel {
  id:number;
  serverName: string;
  serverHostName: string;
  serverPort: number;
  userName: string;
  userPassword: string;
  MaximumParallelTransactoin: number;
  useSecureConnection: boolean;
}