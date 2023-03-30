from flask import Flask, request

app = Flask(__name__)

@app.route("/members")
def members():
    return {"members" : ["clemens", "basti", "asdf"]}

@app.route("/buttons")
def buttons():
    return {"buttons" : [{"title" : "led1", "type" : "led"}, {"title" : "led2", "type" : "led"}, {"title" : "light 1", "type" : "light"}]}

@app.route("/click", methods=["POST"])
def click():
    print("click received from: ", request.get_json() )
    return {}
    

if __name__ == "__main__":
    app.run(debug=True)
