from flask import Flask, request, Response
from flask_cors import CORS
import json
from arduino_comm import NRF_comm, radio_comm

app = Flask(__name__)
CORS(app)

arduino_comms = []

buttonList = [{"title" : "led wall", "type" : "led", "toggled" : False, "selectedAnim" : "Animation 1", "selectedColor" : "#ffffff", "comm_type": "NRF", "rPipe": "0xF0F0F0F001", "wPipe" : "0xF0F0F0F002"},
              {"title" : "led desk", "type" : "led", "toggled" : False, "selectedAnim" : "Animation 2", "selectedColor" : "#ffffff", "comm_type": "NRF","rPipe": "0xF0F0F0F011", "wPipe" : "0xF0F0F0F012"}, 
              {"title" : "light main", "type" : "light", "toggled" : False, "comm_type": "radio", "rfid": "10001000100010001000"},
              {"title" : "light desk", "type" : "light", "toggled" : False, "comm_type": "radio", "rfid": "01000100010001000100"},
              {"title" : "light bed", "type" : "light", "toggled" : False, "comm_type": "radio", "rfid": "00100010001000100010"}]

animationList = [{"title" : "Animation 1"}, {"title" : "Animation 2"}, {"title" : "colorpicker"}]

def save_presets():
    with open("server/savedPresets.json", "w") as file:
        presets = []
        for button in buttonList.copy():
            if(button["type"] == "preset"):
                button["toggled"] = False
                presets.append(button)

        print(presets)
        json.dump(presets, file) 

def load_presets(buttonList):
        try:
            with open("server/savedPresets.json", "r") as file:
                loaded_presets = json.load(file)
                buttonList.extend(loaded_presets)
        except:
            pass


def find_equals(list, key, value):
    for elem in list:
        if(elem[key] == value):
            return elem
    return {}

def send_arduino_msg(button, msg):
    find_equals(arduino_comms, "title", button["title"])["comm"].send(msg)

    #TODO think of msg format for arduino messages (click, anim, color) and send it
    #TODO put comm-pipe-number into buttonlist declaration
    #TODO send RF directly from raspberrypi https://www.einplatinencomputer.com/raspberry-pi-433-mhz-funksteckdose-schalten/
    #TODO make arduino code (put it into arduino folder)
    #TODO make README.md with helpful commands/ instructions for future-me
    #TODO handle stop ongoing retry sending again during retry
    #TODO dont retry color
    
def set_button_state(button, state):
    button["toggled"] = state
    send_arduino_msg(button, {"actionType": "setToggled", "state": state })

    return button
    

def set_led_anim(button, anim):
    button["selectedAnim"] = anim
    send_arduino_msg(button, {"actionType": "setAnim", "anim": animationList.index({"title" : anim})})

    return button

def set_led_color(button, color):
    button["selectedColor"] = color
    send_arduino_msg(button, {"actionType": "setColor", "color": color})

    return button

def handle_user_input(input):
    print("received user input: ", input )

    msgContent = input["content"]

    msgType = input["msgType"]
    if msgType == "click":
            button = find_equals(buttonList, "title" ,msgContent["btnTitle"])
            new_state = not button["toggled"]
            button["toggled"] = new_state
            button = set_button_state(button, new_state)

            if(button["type"] == "preset"):
                for b in buttonList:
                    if any(x["title"] == b["title"] for x in button["toggledButtons"]):
                        b = set_button_state(b, True)
                    elif b["title"] != button["title"] and b["toggled"] == True:
                        b = set_button_state(b, False)

            else:
                for b in buttonList:
                    if b["type"] == "preset" and b["toggled"] == True:
                        b = set_button_state(b, False)


    elif msgType ==  "setAnim":
            button = find_equals(buttonList, "title" , msgContent["btnTitle"])
            new_anim = msgContent["animTitle"]
            button = set_led_anim(button, new_anim)

    elif msgType == "setColor":
        button = find_equals(buttonList, "title" , msgContent["btnTitle"])
        button = set_led_color(button, msgContent["selectedColor"])
            
            
    elif msgType == "renamePreset":
            button = find_equals(buttonList, "title", msgContent["title"])
            button["title"] = msgContent["newTitle"]
            save_presets()

    elif msgType == "createPreset":
            buttonList.append(msgContent)
            save_presets()

    elif msgType == "deletePreset":
            buttonList.remove(find_equals(buttonList, "title", msgContent["title"]))
            save_presets()

    elif msgType == "specialTogglePreset": # occurs when e.g. color/ animation is changed while a preset is toggled so the preset must be set to untoggled
            button = find_equals(buttonList, "title", msgContent["title"])
            button["toggled"] = False


        


@app.route("/buttons")
def buttons():
    return {"buttons" : buttonList}

@app.route("/animations")
def animations():
    return {"animations" : animationList}


@app.route("/userInput", methods=["POST"])
def click():
    handle_user_input(request.get_json())
    return {}
    

if __name__ == "__main__":      
    load_presets(buttonList)

    NRF_comm.static_init()
    radio_comm.static_init()

    for button in buttonList:
        comm = None
        if(button["comm_type"] == "NRF"):
            comm = NRF_comm(button["rPipe"], button["wPipe"])
        else:
            comm = radio_comm(button["rfid"])

        arduino_comms.append({"title" : button["title"], "comm" : comm})
    #192.168.178.29
    app.run(debug=True, host="192.168.178.29", port=5000)

    #app.run(debug=True, host="127.0.0.1", port=5000)
