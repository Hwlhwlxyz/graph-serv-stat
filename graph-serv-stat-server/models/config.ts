import config from "../config.json"  assert { type: "json" };

class serverConfig {
    host: string;
    name: string;
    // authentication
    username: string;
    password: string;
    constructor(jsonObjet: any) {

        this.host = jsonObjet['host'];
        this.name = jsonObjet['name'];
        this.username = jsonObjet['username'];
        this.password = jsonObjet['password'];
    }

    getUserPassToReceive() {
        return this.username+":"+this.password;
    }

    needAuth() {
        if (this.username!=null && this.password!=null) {
            return true;
        }
        else {
            return false;
        }
    }
}

export class Config {
    serversMap:Map<string, serverConfig>;
    constructor() { 
        console.log("constructor start")
        this.serversMap = new Map();
        for (let i=0; i<config.servers.length; i++) {
            let servercfg = new serverConfig(config.servers[i]);
            console.log(servercfg.host, "type", typeof servercfg.host);
            this.serversMap.set(servercfg.host, servercfg);
        }
        console.log(this.serversMap)
        console.log(this.serversMap.get("https://websocketking.com/"));
        console.log("constructor end")
    }

    getConfigByHost(host: string|null) {
        if (host===null) {
            return null;
        }
        else {
            return this.serversMap.get(host);
        }
    }

}

const serverConfiguration = new Config();

export default serverConfiguration;


/**
 * {

    "servers":
    [
        {
            "host":"127.0.0.1",
            "name":"name_test",
            "username": "username",
            "password": "password-for-websocket"
        }
    ]
}
 */