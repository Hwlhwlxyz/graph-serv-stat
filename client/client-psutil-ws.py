#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# reference: https://github.com/BotoX/ServerStatus


USER = "s01"
PASSWORD = "some-hard-to-guess-copy-paste-password"
INTERVAL = 1 # Update interval
WEBSOCKETSERVER = "ws://localhost:8000/ws"

import os
import socket
import time
import string
import math
import json
import collections
import threading

# pip3 install websocket-client psutil rel
import websocket #  install websocket-client
import psutil
import rel

def get_uptime():
	return int(time.time() - psutil.boot_time())

def get_memory():
	Mem = psutil.virtual_memory()
	try:
		MemUsed = Mem.total - (Mem.cached + Mem.free)
	except:
		MemUsed = Mem.total - Mem.free
	return int(Mem.total), int(MemUsed)

def get_swap():
	Mem = psutil.swap_memory()
	return int(Mem.total), int(Mem.used)

def get_hdd():
	valid_fs = [ "ext4", "ext3", "ext2", "reiserfs", "jfs", "btrfs", "fuseblk", "zfs", "simfs", "ntfs", "fat32", "exfat", "xfs" ]
	disks = dict()
	size = 0
	used = 0
	for disk in psutil.disk_partitions():
		if not disk.device in disks and disk.fstype.lower() in valid_fs:
			disks[disk.device] = disk.mountpoint
	for disk in disks.values():
		usage = psutil.disk_usage(disk)
		size += usage.total
		used += usage.used
	return int(size), int(used)

def get_load():
	try:
		return os.getloadavg()[0]
	except:
		return -1.0

def get_cpu():
	return psutil.cpu_percent(interval=INTERVAL)

class Traffic:
	def __init__(self):
		self.rx = collections.deque(maxlen=10)
		self.tx = collections.deque(maxlen=10)
	def get(self):
		avgrx = 0; avgtx = 0
		for name, stats in psutil.net_io_counters(pernic=True).items():
			if name == "lo" or name.find("tun") > -1:
				continue
			avgrx += stats.bytes_recv
			avgtx += stats.bytes_sent

		self.rx.append(avgrx)
		self.tx.append(avgtx)
		avgrx = 0; avgtx = 0

		l = len(self.rx)
		for x in range(l - 1):
			avgrx += self.rx[x+1] - self.rx[x]
			avgtx += self.tx[x+1] - self.tx[x]

		avgrx = int(avgrx / l / INTERVAL)
		avgtx = int(avgtx / l / INTERVAL)

		return avgrx, avgtx

def get_network(ip_version):
	if(ip_version == 4):
		HOST = "ipv4.google.com"
	elif(ip_version == 6):
		HOST = "ipv6.google.com"
	try:
		s = socket.create_connection((HOST, 80), 2)
		return True
	except:
		pass
	return False

def get_net_io():
	netio = psutil.net_io_counters()
	return netio.bytes_recv, netio.bytes_sent 

def get_data():
	traffic = Traffic()
	CPU = get_cpu()
	NetRx, NetTx = traffic.get()
	Uptime = get_uptime()
	Load = get_load()
	MemoryTotal, MemoryUsed = get_memory()
	SwapTotal, SwapUsed = get_swap()
	HDDTotal, HDDUsed = get_hdd()

	array = {}
	# if not timer:
	# 	array['online' + str(check_ip)] = get_network(check_ip)
	# 	timer = 10
	# else:
	# 	timer -= 1*INTERVAL

	array['uptime'] = Uptime
	array['load'] = Load
	array['memory_total'] = MemoryTotal
	array['memory_used'] = MemoryUsed
	array['swap_total'] = SwapTotal
	array['swap_used'] = SwapUsed
	array['hdd_total'] = HDDTotal
	array['hdd_used'] = HDDUsed
	array['cpu'] = CPU
	array['network_rx'] = NetRx
	array['network_tx'] = NetTx
	array['netio_recv'], array['netio_sent'] = get_net_io()
	return json.dumps(array)

def on_message(ws, message):
	print(message)

def on_error(ws, error):
    print(error)

def on_close(ws, close_status_code, close_msg):
    print("### closed ###")

def on_open(ws):
    print("Opened connection")

def run_every_n_seconds(n=INTERVAL):
	while True:
		ws.send(get_data())
		print(time.ctime())
		time.sleep(n) 
    

	


if __name__ == '__main__':
	print(get_data())
	websocket.enableTrace(True)
	ws = websocket.WebSocketApp(WEBSOCKETSERVER,
                              on_open=on_open,
                              on_message=on_message,
                              on_error=on_error,
                              on_close=on_close)

	try:
		ws.run_forever(dispatcher=rel)  # Set dispatcher to automatic reconnection
		ws.send(USER+":"+PASSWORD)
		rel.signal(2, rel.abort)  # Keyboard Interrupt
		thread = threading.Thread(target=run_every_n_seconds, daemon=True)
		thread.start()

		rel.dispatch()
	except Exception as error:
		print(error)

	finally:
		print("end")
		ws.close()
