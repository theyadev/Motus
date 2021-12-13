export default class Player {
    username: string;
    host: boolean;
  
    constructor(username: string, host?: boolean) {
      this.username = username;
      this.host = host || false;
    }
  }