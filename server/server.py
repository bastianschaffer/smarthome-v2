from flask import Flask, request
import json

app = Flask(__name__)

buttonList = [{"title" : "led1", "type" : "led", "toggled" : False, "selectedAnim" : "Animation 1", "selectedColor" : "#ffffff"},
              {"title" : "led2", "type" : "led", "toggled" : False, "selectedAnim" : "Animation 2", "selectedColor" : "#ffffff"}, 
              {"title" : "light 1", "type" : "light", "toggled" : False}]

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

def handle_user_input(input):
    print("received user input: ", input )

    msgContent = input["content"]

    match input["msgType"]:
        case "click":
            button = find_equals(buttonList, "title" ,msgContent["btnTitle"])
            button["toggled"] = not button["toggled"]

            if(button["type"] == "preset"):
                for b in buttonList:
                    if any(x["title"] == b["title"] for x in button["toggledButtons"]):
                        b["toggled"] = True
                    elif b["title"] != button["title"]:
                        b["toggled"] = False

            else:
                for b in buttonList:
                    if b["type"] == "preset":
                        b["toggled"] = False


            #TODO send click to arduino

        case "setAnim":
            button = find_equals(buttonList, "title" , msgContent["btnTitle"])
            button["selectedAnim"] = msgContent["animTitle"]
            
            if msgContent["animTitle"] == "colorpicker":    
                button["selectedColor"] = msgContent["selectedColor"]
            
            #TODO send anim to arduino

        case "renamePreset":
            button = find_equals(buttonList, "title", msgContent["title"])
            button["title"] = msgContent["newTitle"]
            save_presets()

        case "createPreset":
            buttonList.append(msgContent)
            save_presets()

        case "deletePreset":
            buttonList.remove(find_equals(buttonList, "title", msgContent["title"] ))
            save_presets()

        case "specialTogglePreset": # occurs when e.g. color/ animation is changed while a preset is toggled so the preset must be set to untoggled
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
    print(buttonList)


    
    app.run(debug=True)
