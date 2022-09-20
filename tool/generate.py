import json
import shutil
import uuid
import secrets
import os
import argparse

WEBSOCKETSERVER = "ws://localhost:8000/ws" # change to your server host
HOST = "unknown"

def generate_server_config(generated_id, generated_password):
    return {
            "host":HOST,
            "name":str(generated_id),
            "location": "unknown",
            "username": generated_id,
            "password": generated_password
    }

def get_client_py_name(generated_id):
    client_py_name = './client-psutil-ws'+str(generated_id)+'.py'
    return client_py_name

def create_client_py(generated_id, generated_password):
    json_config = None
    client_py_name = None

    # generated_id = str(uuid.uuid1())
    # generated_password = secrets.token_urlsafe(15)

    if not os.path.exists("./config.json"):
        with open("./config.json", 'w') as file:
            pass

    with open("./config.json", 'r') as file:
        if os.path.getsize("./config.json") == 0:
            json_config = {"servers":[]}
        else:
            json_config = json.load(file)
        client_py_name = get_client_py_name(generated_id)
        shutil.copyfile('../client/client-psutil-ws.py', client_py_name)
        
        server_cfg = generate_server_config(generated_id, generated_password)
        
    with open("./config.json", 'w') as file:
        print(json_config)
        if json_config['servers'] is None:
            json_config['servers'] = [server_cfg]
        else:
            json_config['servers'].append(server_cfg)
        print(json_config)
        json.dump(json_config, file, indent=2)

    with open(client_py_name, 'r') as file:
        client_py_data = file.read()
    client_py_data = client_py_data.replace('USER = "s01"', 'USER = "{}"'.format(generated_id))
    client_py_data = client_py_data.replace('PASSWORD = "some-hard-to-guess-copy-paste-password"', 'PASSWORD = "{}"'.format(generated_password))
    client_py_data = client_py_data.replace('WEBSOCKETSERVER = "ws://localhost:8000/ws"', 'WEBSOCKETSERVER = "{}"'.format(WEBSOCKETSERVER))

    with open(client_py_name, 'w') as file:
        file.write(client_py_data)


parser = argparse.ArgumentParser(description='argparse')
parser.add_argument('--host', '-H', help='host, usually is the ip address or domain name of your remote client machine, default is unknown, but it is required', default='unknown')
parser.add_argument('--websocketserver', '-w', help='websocketserver, the ws route of your deployd server, your broswer will connect to this address by websocket, default is ws://localhost:8000/ws (usually doesn\'t work)')
parser.add_argument('--transfer', '-t', help='whether to transfer client-psutil-ws.py to remote client machine, True or False, default is false', choices=[True, False],type=bool, default=False)
parser.add_argument('--port', '-p', help='port of remote client machine, default is 22', type=int,default=22)
parser.add_argument('--username', '-u', help='username of remote clientmachine, default is root', default='root')
parser.add_argument('--destination-path', '--destination', '-d', help='path to store client-psutil-ws.py in the remote machine, default is /root/scripts/', default='/root/scripts/')


args = parser.parse_args()

def apply_args(args):
    global HOST
    global WEBSOCKETSERVER
    if args.host is not None:
        HOST = args.host
    if args.websocketserver is not None:
        WEBSOCKETSERVER = args.websocketserver
    print({'HOST':HOST, 'WEBSOCKETSERVER':WEBSOCKETSERVER})
    (id, password) = (str(uuid.uuid1()), secrets.token_urlsafe(15))
    if args.transfer:
        print("need to transfer")
        client_py_name = get_client_py_name(id)
        cmd_str = "scp -r -P {port} {client_py_name} {username}@{host}:{destination}".format(
                port=args.port, 
                client_py_name=client_py_name,
                username=args.username,
                host=args.host,
                destination=args.destination_path
                )
        mkdir_str = 'ssh -p {port} {username}@{host} "mkdir -p {destination}"'.format(
                port=args.port, 
                username=args.username,
                host=args.host,
                destination=args.destination_path
                )
        print('create client.py, name is:', client_py_name)
        create_client_py(str(id), password)
        print('start to transfer')
        input_str = input('transfer? will run command:'+mkdir_str +'&&'+ cmd_str+' (yes/no) : ')
        if input_str.lower().startswith('y'):
            run_command(mkdir_str +'&&'+ cmd_str)
        else:
            print('terminated')
    else:
        print("do not need to transfer")
        

def run_command(cmd_str):
    os.system(cmd_str)


if __name__ == '__main__':
    apply_args(args)

