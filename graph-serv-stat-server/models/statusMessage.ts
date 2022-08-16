export class statusMessage {
    host: string;
    status: any;

    constructor(host: string, status: any) {
        this.host = host;
        this.status = status;
    }

    toJSON() {
        return {"host": this.host, "status": this.status};
    }
}