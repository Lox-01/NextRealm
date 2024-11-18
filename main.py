from flask import Flask, render_template, request, redirect, url_for, session, flash
from flask_socketio import SocketIO
from socket_events import *
from player import Player
import json, os

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins=["http://localhost:8080", "http://127.0.0.1:8080"])

players = {}
client_ids = []

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/signup', methods=['POST'])
def signup():
    username = request.form["username"]
    if os.path.exists("./data/users.json"):
        users=json.load(open('./data/users.json'))
    elif os.path.exists("./NextRealm/data/users.json"):
        users=json.load(open('./NextRealm/data/users.json'))
    if username not in users:
        permid = max([user[0] for user in users.values()])+1
        users[username] = [permid, { "x"  : 0, "y"  : 1, "z"  : 0 }, { "xr" : 0, "yr" : 0, "zr" : 0 }, 50]
        if os.path.exists("./data/users.json"):
            json.dump(users, open("./data/users.json", "w"), indent = 2)
        elif os.path.exists("./NextRealm/data/users.json"):
            json.dump(users, open("./NextRealm/data/users.json", "w"), indent = 2)
        session["id"] = users[username][0]
        return redirect(url_for('game'))
    else:
        flash('Username already exists', 'error')
        return redirect(url_for('index'))

@app.route('/login', methods=['POST'])
def login():
    username = request.form["username"]
    client_id = request.form["client_id"]
    if os.path.exists("./data/users.json"):
        users=json.load(open('./data/users.json'))
    elif os.path.exists("./NextRealm/data/users.json"):
        users=json.load(open('./NextRealm/data/users.json'))
    if username not in users:
        flash('Username does not exist', 'error')
        return redirect(url_for('index'))
    else:
        session["id"] = users[username][0]
        session["username"] = username
        if int(users[username][0]) in players or client_id in client_ids:
            flash('You are already logged in somewhere', 'error')
            return redirect(url_for('index'))
        else:
            return redirect(url_for('game'))
        
@app.route('/game')
def game():
    if 'id' not in session:
        flash('You need to be signed in to access the game', 'error')
        return redirect(url_for('index'))
    else:
        return render_template('game.html')

@socketio.on('connect')
def connect():
    player_id = request.args.get('player_id')
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
