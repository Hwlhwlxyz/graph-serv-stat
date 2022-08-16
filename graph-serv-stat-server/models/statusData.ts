export class statusData {
    host: string;

    load: number;
    memory_used: number;
    uptime: number;
    online0: boolean;
    swap_total: number;
    swap_used: number;
    memory_total: number;
    network_tx: number;
    hdd_used: number;
    network_rx: number;
    cpu: number;
    hdd_total: number;

    constructor(host: string, receiveObject: any) {
        this.host = host;

        this.load=receiveObject['load']
        this.memory_used=receiveObject['memory_used']
        this.uptime=receiveObject['uptime']
        this.online0=receiveObject['online0']
        this.swap_total=receiveObject['swap_total']
        this.swap_used=receiveObject['swap_used']
        this.memory_total=receiveObject['memory_total']
        this.network_tx=receiveObject['network_tx']
        this.hdd_used=receiveObject['hdd_used']
        this.network_rx=receiveObject['network_rx']
        this.cpu=receiveObject['cpu']
        this.hdd_total=receiveObject['hdd_total']
    }

    toArray() {
        return [
            this.host,
            this.load,
            this.memory_used,
            this.uptime,
            this.online0,
            this.swap_total,
            this.swap_used,
            this.memory_total,
            this.network_tx,
            this.hdd_used,
            this.network_rx,
            this.cpu,
            this.hdd_total,
        ]
    }

    get(key: string) {
        let queryKey = key as (keyof statusData);
        if (this[queryKey]!=undefined) {
            return this[queryKey];
        }
        else if (this.getCalculatedValue(key)!=null){
            return this.getCalculatedValue(key);
        }
        else {
            console.log(key+",key not exists in statusData");
            return undefined;
        }
    }

    getCalculatedValue(key: string) {
        switch (key) {
            case "network_tx_rx":
                return this.network_tx+"|"+this.network_rx;
            case "hdd_percentage":
                return (this.hdd_used/this.hdd_total);
            case "memory_percentage":
                return (this.memory_used/this.memory_total);
            case "cpu_percentage":
                return this.cpu;
            default:
                return null;
        }

    }
}