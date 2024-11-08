from flask import Flask, render_template, request, redirect, url_for, session, flash
from flask_socketio import SocketIO
from socket_events import *
from player import Player

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins=[
    "http://localhost:8080",
    "http://127.0.0.1:8080"
])

players = {}

@app.route('/signup')
def signup():
    return render_template('signup.html')

@app.route('/game')
def game():
    if 'username' not in session:
        return redirect(url_for('signup'))
    return render_template('game.html')

@socketio.on('connect')
def connect():
    on_connect(socketio, players)

@socketio.on('disconnect')
def disconnect():
    pass

@socketio.on('id_unclaim')
def unclaim(player_id):
    on_unclaim(player_id, players, socketio)

@socketio.on('player_move')
def player_moved(data):
    on_player_move(data, players, socketio)

@socketio.on('new_msg')
def send_msg(vals):
    on_new_msg(vals, players, socketio)

@socketio.on("debug")
def debug(data):
    on_debug(data)

@socketio.on('player_hit')
def player_hit(player_id):
    on_player_hit(player_id, players, socketio)

if __name__ == '__main__':
    socketio.run(app, host="0.0.0.0", port=8080)
