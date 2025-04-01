from flask import Flask, render_template, request, redirect, url_for, session, flash
from flask_socketio import SocketIO
from socket_events import *
from player import Player
from monster import Monster
from assets_blueprint import assets_blueprint
import json, os, time, math

if os.getenv("ENABLE_DEBUG") == "true":
    print("debug mode")
    import debugpy
    debugpy.listen(("0.0.0.0", 5678))
    print("Debugpy is waiting for the debugger to attach...") 
    debugpy.wait_for_client()

app = Flask(
    __name__,
    static_url_path="/",
    static_folder="static",
    template_folder="templates",
)
app.config['SECRET_KEY'] = 'secret!'

# Provide Vite context processors and static assets directory.
app.register_blueprint(assets_blueprint)

socketio = SocketIO(app, cors_allowed_origins=["http://45.90.12.32:6052", "http://localhost:6052", "http://127.0.0.1:6052"])

players = {}
monsters = {}
client_ids = []

if os.path.exists("./data/mons.json"):
    tempmons = json.load(open('./data/mons.json'))
    for mon in tempmons:
        tm = tempmons[mon]
        monsters[mon] = Monster(tm["name"], tm["totalhp"], tm["totalhp"], tm["attack"], tm["arange"], tm["cooldown"], tm["origin"], tm["rotation"], tm["aggrorange"], tm["followrange"], tm["speed"], mon, tm["modelpath"])
elif os.path.exists("./NextRealm/data/mons.json"):
    tempmons = json.load(open('./NextRealm/data/mons.json'))
    for mon in tempmons:
        tm = tempmons[mon]
        monsters[mon] = Monster(tm["name"], tm["totalhp"], tm["totalhp"], tm["attack"], tm["arange"], tm["cooldown"], tm["origin"], tm["rotation"], tm["aggrorange"], tm["followrange"], tm["speed"], mon, tm["modelpath"])

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/signup', methods=['POST'])
def signup():
    global client_ids
    username = request.form["username"]
    client_id = request.form["client_id"]
    #if client_id in client_ids:
    #    flash('You are already logged in somewhere', 'error')
    #    return redirect(url_for('index'))
    client_ids.append(client_id)
    if os.path.exists("./data/users.json"):
        users=json.load(open('./data/users.json'))
    elif os.path.exists("./NextRealm/data/users.json"):
        users=json.load(open('./NextRealm/data/users.json'))
    if username not in users:
        permid = max([user["id"] for user in users.values()])+1
        users[username] = {"id": permid, "pos": { "x"  : 0, "y"  : 0.5, "z"  : 0 }, "rot": { "xr" : 0, "yr" : 0, "zr" : 0 }, "hp": 50, "totalhp": 50}
        if os.path.exists("./data/users.json"):
            json.dump(users, open("./data/users.json", "w"), indent = 2)
        elif os.path.exists("./NextRealm/data/users.json"):
            json.dump(users, open("./NextRealm/data/users.json", "w"), indent = 2)
        session["id"] = users[username]['id']
        session["username"] = username
        return redirect(url_for('game'))
    else:
        flash('Username already exists', 'error')
        return redirect(url_for('index'))

@app.route('/login', methods=['POST'])
def login():
    global client_ids
    username = request.form["username"]
    client_id = request.form["client_id"]
    #if client_id in client_ids:
    #    flash('You are already logged in somewhere', 'error')
    #    return redirect(url_for('index'))
    client_ids.append(client_id)
    if os.path.exists("./data/users.json"):
        users=json.load(open('./data/users.json'))
    elif os.path.exists("./NextRealm/data/users.json"):
        users=json.load(open('./NextRealm/data/users.json'))
    if username not in users:
        flash('Username does not exist', 'error')
        return redirect(url_for('index'))
    else:
        session["id"] = users[username]['id']
        session["username"] = username
        if int(users[username]['id']) in players:
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
    on_connect(socketio, player_id, players, monsters)

@socketio.on('offline')
def offline(vals):
    player_id, client_id = vals[0], vals[1]
    on_offline(player_id, players, socketio, client_id, client_ids, monsters)

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
def player_hit(ids):
    on_player_hit("player", ids[0], players, socketio, ids[1], monsters, ids[2])

@socketio.on("respawn")
def respawn(id):
    on_respawn(players, id, socketio)

def monster_to_origin(monster):
    monster.move_to_origin()
    socketio.emit('monster_position_update', monster.to_dict())

def monster_threats(monster):
    for player_id, player in players.items():
        if monster.is_in_aggrorange(player):
            if player_id not in monster.threats:
                monster.threats[player_id] = [1, time.time()]
            else:
                monster.threats[player_id][1] = time.time()
        elif player_id in monster.threats:
            monster.decay_threat(player)

def monster_behavior(monster, monster_id):
    if not monster.threats:
        if monster.position != monster.origin:
            monster_to_origin(monster)
        return
    maxthreatid = max_threat(monster)
    if monster.is_in_arange(players[maxthreatid]):
        on_player_hit("monster", maxthreatid, players, socketio, monster_id, monsters, "player")
    elif monster.is_in_aggrorange(players[maxthreatid]):
        monster.move_to_player(players[maxthreatid])
        socketio.emit('monster_position_update', monster.to_dict())

def max_threat(monster):
    maxthreat = max(monster.threats.values(), key=lambda threat: threat[0])[0]
    candidates = [pid for pid, threat in monster.threats.items() if threat[0] == maxthreat and pid in players]
    if len(candidates) > 1:
        return min(candidates, key=lambda pid: distance(monster, players[pid]))
    return candidates[0]

def distance(monster, player):
    return math.sqrt((monster.position["x"] - player.position["x"]) ** 2 +(monster.position["y"] - player.position["y"]) ** 2 +(monster.position["z"] - player.position["z"]) ** 2)

def game_loop():
    global printed
    while True:
        for monster_id, monster in monsters.items():
            if not monster.alive:
                monster.try_respawn(socketio)
                continue
            if not monster.is_in_followrange():
                monster_to_origin(monster)
                continue
            monster_threats(monster)
            monster_behavior(monster, monster_id)
        time.sleep(0.1)

if __name__ == '__main__':
    allow_unsafe = os.getenv("ALLOW_UNSAFE_WERKZEUG", "false").lower() == "true"
    socketio.start_background_task(game_loop)
    socketio.run(app, host="0.0.0.0", port=6052, allow_unsafe_werkzeug=allow_unsafe)