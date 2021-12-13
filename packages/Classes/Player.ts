export default class Player {
    username: string;
    socketId: string;
    host: boolean;
    gridId?: number; 
  
    constructor(username: string, socketId: string, host?: boolean) {
      this.username = username;
      this.host = host || false;
      this.socketId = socketId
    }
  }