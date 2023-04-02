from flask import Flask, request

app = Flask(__name__)

@app.route("/members")
def members():
    return {"members" : ["clemens", "basti", "asdf"]}

@app.route("/buttons")
def buttons():
    return {"buttons" : [{"title" : "led1", "type" : "led", "toggled" : False, "selectedAnim" : "Animation 1"}, {"title" : "led2", "type" : "led", "toggled" : False, "selectedAnim" : "Animation 2"}, {"title" : "light 1", "type" : "light", "toggled" : False},
                         {"title" : "preset1", "type": "preset", "toggled" : False, "toggledButtons" : ["led1", "light 1"]}]}

@app.route("/animations")
def animations():
    return {"animations" : [{"title" : "Animation 1"}, {"title" : "Animation 2"}, {"title" : "colorpicker"}]}

@app.route("/selectedAnimation")
def selectedAnimation():
    return "Animation 2"
#TODO: make selectedAnimation part of the buttons (selectedAnimation attribute if type is led)

#@app.route("/presets")
#def presets():
#    return {"presets" : [{"title" : "preset1", "toggledButtons" : ["button1", "button2"]}]}



@app.route("/click", methods=["POST"])
def click():
    print("click received from: ", request.get_json() )
    return {}
    

if __name__ == "__main__":
    app.run(debug=True)
