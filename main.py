from flask import Flask, render_template, request, redirect, url_for, session, flash
from flask_socketio import SocketIO
from socket_events import *
from player import Player
import json

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins=[
    "http://localhost:8080",
    "http://127.0.0.1:8080"
])

players = {}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/signup', methods=['POST'])
def signup():
    username = request.form['username']
    users = json.load(open('./data/users.json'))
    if username not in users:
        permid = max(users.values())+1
        users[username] = permid
        json.dump(users, open("./data/users.json", "w"), indent = 2)
        session["id"] = permid
        return render_template('game.html', id=session["id"])
    else:
        flash('Username already exists', 'error')
        return redirect(url_for('index'))

@app.route('/login', methods=['POST'])
def login():
    username = request.form['username']
    users = json.load(open('./data/users.json'))
    if username not in users:
        flash('Username does not exist', 'error')
        return redirect(url_for('index'))
    else:
        session["id"] = users[username]
        return render_template('game.html', id=session["id"])
        
@app.route('/game')
def game():
    if 'id' not in session:
        flash('You need to be signed in to access the game', 'error')
        return redirect(url_for('index'))
    else:
        return render_template('game.html', id=session["id"])

@socketio.on('connect')
def connect(player_id):
    on_connect(socketio, player_id, players)

@socketio.on('offline')
def offline(player_id):
    on_offline(player_id, players, socketio)

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
