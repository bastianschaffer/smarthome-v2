import json
import time
import sys
from arduino_comm import radio_comm

"""
how to get into mode 3 of 433mhz module:

-   press 8 times to reset
-   press 3 times for mode 3
-   send toggle_on until received
-   send toggle_off immediately after toggle_on was received
"""

def main():
    if len(sys.argv) <= 2:
        print("expecting arguments: <button title> <on/off>")
        return

    radio_comm.static_init()

    buttonList = None
    with open("buttonList.json", 'r') as buttonFile:
        buttonList = json.load(buttonFile)

    button = None
    title = sys.argv[1]
    for b in buttonList:
        if b["title"] == title:
            button  = b
    if button == None:
        print("expecting button as first argument, but button ", title, " does not exist")
        return

    comm = radio_comm(button["rfid"])


    if sys.argv[2] == "on":
        for i in range(1000):
            comm.send_toggle_on()
            print("sending...")
            time.sleep(0.1)
    elif sys.argv[2] == "off":
        for i in range(1000):
            comm.send_toggle_off()
            print("sending...")
            time.sleep(0.1)
    else:
        print("wrong argument: ", sys.argv[0])

if __name__ == "__main__":  

    main()