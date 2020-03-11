export class ConnectionOptions{
    /**
     * user
     */
    user:string;
    /**
     * password
     */
    password:string;
    /**
     * server
     */
    server:string;
    /**
     * database
     */
    database:string;

    /**
     *构造函数
     */
    constructor(user:string,password:string,server:string,database:string) {
        this.user=user;
        this.password=password;
        this.server=server;
        this.database=database;
    }
}