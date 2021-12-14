export default class Player {
    username: string;
    socketId: string;
    host: boolean;
    gridId?: string; 
  
    constructor(username: string, socketId: string, host?: boolean) {
      this.username = username;
      this.host = host || false;
      this.socketId = socketId
    }
  }