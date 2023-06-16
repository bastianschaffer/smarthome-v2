import time
from RF24 import *
from rpi_rf import RFDevice

millis = lambda: int(round(time.time() * 1000))

class NRF_comm:

    max_retries = 10
    timeout_ms = 500
    chip_enable_pin = 17
    chip_select_pin = 0
    radio = None
    payload_size = 8
    reading_pipe_number = 1

    start_send_time = 0
    

    @staticmethod
    def add_reading_pipe(pipe):
        print("opening reading pipe ", pipe)
        NRF_comm.radio.openReadingPipe(NRF_comm.reading_pipe_number, pipe)
        NRF_comm.reading_pipe_number += 1

    @staticmethod
    def static_init():
        NRF_comm.radio = RF24(NRF_comm.chip_enable_pin, NRF_comm.chip_select_pin)
        NRF_comm.radio.begin()
        NRF_comm.radio.setPALevel(RF24_PA_MAX)
        NRF_comm.radio.enableDynamicPayloads()
        NRF_comm.radio.setRetries(5,15)

    def __init__(self, reading_pipe, writing_pipe):
        self.reading_pipe = reading_pipe
        self.writing_pipe = writing_pipe
        self.start_send_time = None
        NRF_comm.add_reading_pipe(self.hexstr_to_int(reading_pipe))
       
    def translate_msg(self, msg):
        prefix = 0
        content = ""
        if msg["actionType"] == "setToggled":
            prefix = 0
            content = '1' if msg["state"] == True else '0' 
        if msg["actionType"] == "setAnim":
            prefix = 1
            content = msg["anim"]
        elif msg["actionType"] == "setColor":
            prefix = 2
            content = msg["color"]

        return f"{prefix}{content}"

    def hexstr_to_int(self, string):
        return int(string, 16)

    def send(self, msg, retries=0, local_start_time=None):
        if NRF_comm.radio == None:
            print("Not initiated. Can't send") 
            return
        
        if retries > NRF_comm.max_retries:
            print("No response received")
            return
        
        if retries == 0:
            now = millis()
            if (now - NRF_comm.start_send_time) < 10 and msg["actionType"] == "setColor":
                return
            NRF_comm.start_send_time = now
            self.start_send_time = now
            local_start_time = now

            NRF_comm.radio.flush_rx()
            NRF_comm.radio.flush_tx()
        else:
            if local_start_time != NRF_comm.start_send_time:
                return
        
        
        code = self.translate_msg(msg)

        NRF_comm.radio.stopListening()
        NRF_comm.radio.openWritingPipe(self.hexstr_to_int(self.writing_pipe))


        NRF_comm.radio.write(bytes(code[:NRF_comm.payload_size], encoding="utf-8"), 32)

        retry = msg["actionType"] != "setColor"
        if not retry:
            return
        
        NRF_comm.radio.startListening()
        start_time = millis()
        timed_out = False
        while (not NRF_comm.radio.available()) and (not timed_out):
            if (millis() - start_time) > NRF_comm.timeout_ms:
                timed_out = True
        
        if timed_out:
            self.send(msg, retries+1, local_start_time)
        else:
            response = NRF_comm.radio.read(1)
            if bytearray.fromhex(self.reading_pipe[10:12] ) == response:
                print("Msg was received by Arduino.")
            else:
                self.send(msg, retries+1, local_start_time)


    
    


class radio_comm:
    button_on = "1000"
    button_off = "0111"

    max_retries = 10
    data_pin = 23
    protocol = 1
    pulse_length = 350
    rfdevice = None

    start_send_time = None


    @staticmethod
    def static_init():
        radio_comm.rfdevice = RFDevice(radio_comm.data_pin)
        radio_comm.rfdevice.enable_tx()


    def __init__(self, radio_ID):
        self.radio_ID = radio_ID
        
    def send_radio_msg(self, msg):
        int_msg = int(msg, 2)
        radio_comm.rfdevice.tx_code(int_msg, radio_comm.protocol, radio_comm.pulse_length, 24)

    def send_toggle_on(self):
        msg = f"{self.radio_ID}{radio_comm.button_on}"
        self.send_radio_msg(msg)

    def send_toggle_off(self):
        msg = f"{self.radio_ID}{radio_comm.button_off}"
        self.send_radio_msg(msg)

    def send(self, code):
        if radio_comm.rfdevice == None:
            print("Not initiated. Can't send") 
            return
        
        now = millis()
        radio_comm.start_send_time = now
        local_start_send_time = now
        
        for i in range(radio_comm.max_retries):
            if radio_comm.start_send_time != local_start_send_time:
                return

            if(code["state"] == True):
                self.send_toggle_on()
            else:
                self.send_toggle_off()
    