#!/bin/bash
start_server() {
	# . /home/pi/.../activate is the equivalent to source /home/pi/.../activate for sh	
	cd /home/pi/Documents/smarthome-v2/ && . /home/pi/Documents/smarthome-v2/server/venv/bin/activate && python server/server.py
    
}

start_npm() {
    cd /home/pi/Documents/smarthome-v2/client && npm start 
}

echo starting up smarthome application...
sleep 30
start_server &
start_npm &
