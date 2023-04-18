import time
#from RF24 import *
#from rpi_rf import RFDevice

class NRF_comm:
    

    def __init__(self, reading_pipe, writing_pipe):
        self.radio = None
        self.writing_pipe = None    #[0xF0F0F0F0E1, 0xF0F0F0F0D2]
        self.payload_size = 32
        
        self.writing_pipe = writing_pipe

        #self.radio = RF24(17, 0)
        #self.radio.begin()
        #self.radio.enableDynamicPayloads()
        #self.radio.setRetries(5,15)
        #self.radio.openWritingPipe(writing_pipe)

    def send(self, code):
        #self.radio.stopListening()
        #self.radio.write(bytes(code[:payload_size], encoding="utf-8"))
        print("senging NRF: " , code)




class radio_comm:
    button_on = "0001"
    button_off = "0000"

    data_pin = 27
    rfdevice = None


    @staticmethod
    def static_init():
        radio_comm.rfdevice = "temp"
        #radio_comm.rfdevice = RFDevice(radio_comm.data_pin)
        #radio_comm.rfdevice.enable_tx()
        pass    


    def __init__(self, radio_ID):
        self.radio_ID = radio_ID

        


    def send_toggle_on(self):
        msg = f"{self.radio_ID}{radio_comm.button_on}"
        print("sending radio: ", msg)
        pass

    def send_toggle_off(self):
        msg = f"{self.radio_ID}{radio_comm.button_off}"
        print("sending radio: ", msg)
        pass

    def send(self, code):
        if radio_comm.rfdevice == None:
            print("rf not initiated. Can't send") 
            return
        print("state:  ", code["state"])

        if(code["state"] == True):
            self.send_toggle_on()
        else:
            self.send_toggle_off()
    