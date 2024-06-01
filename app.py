import os
from flask import Flask, render_template
from flask_socketio import SocketIO, join_room, leave_room
import serial
import threading

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origin="*")

serialPort = os.getenv('SERIAL_PORT')

try:
    arduino = serial.Serial(serialPort, 9600)
    arduino.timeout = 1
except:
    pass

@app.route('/')
def index():
    return render_template('index2.html')

@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

@socketio.on('join')
def on_join(data):
    room = data['room']
    join_room(room)
    print(f'Client joined room: {room}')

@socketio.on('leave')
def on_leave(data):
    room = data['room']
    leave_room(room)
    print(f'Client left room: {room}')

def read_from_serial():
    card_present = False
    card_uid = None

    while True:
        try:
            line = arduino.readline().decode('utf-8').strip()
            if line and line.startswith('Card UID:'):
                uid = line.split(': ')[1].replace(' ', '')
                if not card_present or card_uid != uid:
                    card_uid = uid
                    socketio.emit('card_detected', {'uid': uid}, room='room1')
                    card_present = True
        except:
            pass

if __name__ == '__main__':
    serial_thread = threading.Thread(target=read_from_serial)
    serial_thread.daemon = True
    serial_thread.start()
    socketio.run(app, host='0.0.0.0', port=65432, debug=True)