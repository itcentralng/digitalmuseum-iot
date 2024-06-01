import RPi.GPIO as GPIO
from mfrc522 import SimpleMFRC522
from flask import Flask, render_template
from flask_socketio import SocketIO, join_room, leave_room

app = Flask(__name__)
socketio = SocketIO(app)

card_present = False

@app.route('/')
def index():
    return render_template('index.html')

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

def rfid_reader():
    global card_present
    reader = SimpleMFRC522()

    try:
        print("Hold a card near the reader")

        # Continuously detect cards
        while True:
            # Scan for cards
            id, text = reader.read()

            # If a card is present and was not present before, send a "card detected" signal
            if id and not card_present:
                print("Card detected. UID:", id)
                socketio.emit('card_detected', {'uid': id}, room='room1')  # Replace 'room1' with your room name
                card_present = True

            # If no card is present and a card was present before, send a "card removed" signal
            elif not id and card_present:
                print("Card removed")
                socketio.emit('card_removed', room='room1')  # Replace 'room1' with your room name
                card_present = False

    finally:
        GPIO.cleanup()

if __name__ == '__main__':
    import threading
    rfid_thread = threading.Thread(target=rfid_reader)
    rfid_thread.daemon = True
    rfid_thread.start()
    socketio.run(app, host='0.0.0.0', port=65432)
