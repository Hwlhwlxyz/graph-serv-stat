import json
import shutil
import uuid
import secrets
import os

def generate_config_server(generated_id, generated_password):
    return {
            "host":"input your host here",
            "name":generated_id,
            "location": "unknown",
            "username": generated_id,
            "password": generated_password
    }

json_config = None

if not os.path.exists("./config.json"):
    with open("./config.json", 'w') as file:
        pass

with open("./config.json", 'r') as file:
    if os.path.getsize("./config.json") == 0:
        json_config = {"servers":[]}
    else:
        json_config = json.load(file)
    generated_id = str(uuid.uuid1())
    generated_password = secrets.token_urlsafe(15)
    shutil.copyfile('../client/client-psutil-ws.py', './client-psutil-ws'+generated_id+'.py')
    
    server_cfg = generate_config_server(generated_id, generated_password)
    
with open("./config.json", 'w') as file:
    print(json_config)
    if json_config['servers'] is None:
        json_config['servers'] = [server_cfg]
    else:
        json_config['servers'].append(server_cfg)
    print(json_config)
    json.dump(json_config, file, indent=2)