# pip install mfrc522
import RPi.GPIO as GPIO
from mfrc522 import SimpleMFRC522
import socket

# Setup the RFID reader
reader = SimpleMFRC522()

# Setup the socket server
HOST = '127.0.0.1'  # The server's hostname or IP address
PORT = 65432        # The port used by the server
server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server_socket.bind((HOST, PORT))
server_socket.listen()

try:
    print("Waiting for client connection...")
    conn, addr = server_socket.accept()
    print("Connected to:", addr)

    print("Hold a card near the reader")

    card_present = False

    # Continuously detect cards
    while True:
        # Scan for cards
        id, text = reader.read()

        # If a card is present and was not present before, send a "card detected" signal
        if id and not card_present:
            print("Card detected. UID:", id)
            conn.sendall(id.encode())
            card_present = True

        # If no card is present and a card was present before, send a "card removed" signal
        elif not id and card_present:
            print("Card removed")
            conn.sendall(b'Card removed')
            card_present = False

finally:
    conn.close()
    GPIO.cleanup()
