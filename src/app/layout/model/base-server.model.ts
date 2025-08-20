export interface BaseServerModel {
  id: number;
  serverName: string;
  serverHostName: string;
  serverPort: string;
  userName: string;
  userPassword: string;
  maximumParallelTransaction?: string;
  useSecureConnection: number;
  // Additional properties that might be present in ServerData
  serverCode?: string;
  contextPath?: string;
  repositoryName?: string;
  databaseType?: string;
}