interface BaseServer {
  serverName: string;
  serverHostName: string;
  serverPort: number;
  userName: string;
  userPassword: string;
  MaximmParallelTransactoin: number;
  useSecureConnection: boolean;
}