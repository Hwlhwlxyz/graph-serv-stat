import { serverConfig } from "./config.ts";

export class statusData {
    serverconfig: serverConfig|undefined;
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
    netio_recv: number;
    netio_sent: number;


    constructor(host: string, receiveObject: any, serverconfig: serverConfig | undefined) {
        this.serverconfig = serverconfig;

        this.host = host;
        this.load = receiveObject['load']
        this.memory_used = receiveObject['memory_used']
        this.uptime = receiveObject['uptime']
        this.online0 = receiveObject['online0']
        this.swap_total = receiveObject['swap_total']
        this.swap_used = receiveObject['swap_used']
        this.memory_total = receiveObject['memory_total']
        this.network_tx = receiveObject['network_tx']
        this.hdd_used = receiveObject['hdd_used']
        this.network_rx = receiveObject['network_rx']
        this.cpu = receiveObject['cpu']
        this.hdd_total = receiveObject['hdd_total']
        this.netio_sent = receiveObject['netio_sent']
        this.netio_recv = receiveObject['netio_recv']
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
        const queryKey = key as (keyof statusData);
        if (this[queryKey] != undefined) {
            return this[queryKey];
        }
        else if (this.getCalculatedValue(key) != null) {
            return this.getCalculatedValue(key);
        }
        else if (this.serverconfig!=undefined) {
            return this.serverconfig.get(key); //[key as (keyof serverConfig)];
        }
        else {
            console.log(key + ",key not exists in statusData");
            return undefined;
        }
    }



    


    getCalculatedValue(key: string) {
        switch (key) {
            case "network_tx_rx":
                return this.network_tx + "|" + this.network_rx;
            case "network_tx_rx_calc":
                return calculateNetworkDigitalInfo(this.network_tx) + "↓|" + calculateNetworkDigitalInfo(this.network_rx)+"↑";
            case "hdd_percentage":
                return (this.hdd_used / this.hdd_total);
            case "memory_percentage":
                return (this.memory_used / this.memory_total);
            case "cpu_percentage":
                return this.cpu;
            case "uptime_day":
                return Math.floor(this.uptime / 60 / 60 / 24);
            case "netio_recv_sent":
                return calculateNetworkDigitalInfo(this.netio_recv) + "↓|" + calculateNetworkDigitalInfo(this.netio_sent)+"↑"
            default:
                return null;
        }

    }
}

// The International System of Units (SI) 
export function bytesToSize(bytes: number, precision: number, si = false) {
    let ret;
    let kilobyte;
    let megabyte;
    let gigabyte;
    let terabyte;
    if (si == true) {
        kilobyte = 1000;
        megabyte = kilobyte * 1000;
        gigabyte = megabyte * 1000;
        terabyte = gigabyte * 1000;
    } else {
        kilobyte = 1024;
        megabyte = kilobyte * 1024;
        gigabyte = megabyte * 1024;
        terabyte = gigabyte * 1024;
    }

    if ((bytes >= 0) && (bytes < kilobyte)) {
        return bytes + ' B';

    } else if ((bytes >= kilobyte) && (bytes < megabyte)) {
        ret = (bytes / kilobyte).toFixed(precision) + ' K';

    } else if ((bytes >= megabyte) && (bytes < gigabyte)) {
        ret = (bytes / megabyte).toFixed(precision) + ' M';

    } else if ((bytes >= gigabyte) && (bytes < terabyte)) {
        ret = (bytes / gigabyte).toFixed(precision) + ' G';

    } else if (bytes >= terabyte) {
        ret = (bytes / terabyte).toFixed(precision) + ' T';

    } else {
        return bytes + ' B';
    }
    if (si == true) {
        return ret + 'B';
    } else {
        return ret + 'iB';
    }
}


function calculateNetworkDigitalInfo(num: number) {
    if (isNaN(num)) {return "No Data"}
    let result = "";
    if (num < 1000) { result = num.toFixed(0) + "B"; }
    else if (num < 1000 * 1000) { result += (num / 1000).toFixed(0) + "K"; }
    else if (num < 1000 * 1000 * 1000) { result += (num / 1000 / 1000).toFixed(1) + "M"; }
    else { result += (num / 1000 / 1000 / 1000).toFixed(1) + "G"; }
    return result;
}

