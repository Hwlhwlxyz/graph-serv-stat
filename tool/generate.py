import json
import shutil
import uuid
import secrets
import os

WEBSOCKETSERVER = "ws://localhost:8000/ws" # change to your server host

def generate_config_server(generated_id, generated_password):
    return {
            "host":"input your host here",
            "name":generated_id,
            "location": "unknown",
            "username": generated_id,
            "password": generated_password
    }

json_config = None
client_py_name = None

generated_id = str(uuid.uuid1())
generated_password = secrets.token_urlsafe(15)

if not os.path.exists("./config.json"):
    with open("./config.json", 'w') as file:
        pass

with open("./config.json", 'r') as file:
    if os.path.getsize("./config.json") == 0:
        json_config = {"servers":[]}
    else:
        json_config = json.load(file)
    client_py_name = './client-psutil-ws'+generated_id+'.py'
    shutil.copyfile('../client/client-psutil-ws.py', client_py_name)
    
    server_cfg = generate_config_server(generated_id, generated_password)
    
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

