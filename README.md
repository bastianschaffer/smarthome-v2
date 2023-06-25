# RaspberryPi Installation from zero

- download 32 bit os (NOT 64 Bit. I get errors at the ./install.sh in the 64 Bit version. No idea why though)
- connect with ssh: 
	-nslookup raspberrypi
	-ssh pi@192...
	-if error: ssh-keygen -R 192...
- sudo apt update
- sudo apt upgrade

- https://nrf24.github.io/RF24/md_docs_linux_install.html (automated install, only need to say yes to git and RF24 core library. Use SPIDEV. Dont mind errors at the end)
- https://nrf24.github.io/RF24/md_docs_python_wrapper.html (python 3)
- python3 setup.py build
- if error "error: command '/usr/bin/arm-linux-gnueabihf-g++' failed with exit code 1" (but i think it is covered by one of the first steps on the website)
	-sudo apt install build-essential python3-dev 
	-sudo python3 setup.py clean
	-python3 setup.py build
- setup ssh with github:
	-https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent
	-mkdir ~/.ssh (and cd into it)
	-use cat to copy public key

- clone repo
- pip install -U flask-cors
- pip3 install rpi-rf
- sudo raspi-config -> interface options -> enable spi
- use python3 server.py

- sudo su
- curl -fsSL https://deb.nodesource.com/setup_17.x | bash -
- sudo apt install nodejs
- if npm not working:
	- sudo su
	- apt-get -f install npm
- npm install (installes the node modules for the project)

