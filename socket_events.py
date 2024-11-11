from flask_socketio import emit
from player import Player
import json # Not sure if this is necessary but it might be.

def on_connect(socketio, player_id, players):
    users = json.load(open('./NextRealm/data/users.json'))
    for username in users:
        if users[username][0] == player_id:
            user = users[username]
    players[player_id] = Player(player_id, user[1], user[2], user[3])
    socketio.emit("render_players", {pid: player.to_dict() for pid, player in players.items()})

def on_offline(player_id, players, socketio):
    users = json.load(open('./NextRealm/data/users.json'))
    for username in users:
        if users[username][0] == player_id:
            users[username] = [players[player_id].id, players[player_id].position, players[player_id].rotation, players[player_id].hp]
    json.dump(users, open("./NextRealm/data/users.json", "w"), indent = 2)
    print(f"id {player_id} disconnected")
    if player_id in players:
        del players[player_id]
    socketio.emit("render_players", {pid: player.to_dict() for pid, player in players.items()})

def on_player_move(data, players, socketio):
    player_id = data["id"]
    pos = data["pos"]
    rot = data["rot"]
    if player_id in players:
        players[player_id].update_position(pos)
        players[player_id].update_rotation(rot)
    socketio.emit("render_players", {pid: player.to_dict() for pid, player in players.items()})

def on_new_msg(vals, players, socketio):
    msg = vals[0]
    splitted = msg.split(" ")
    if splitted[0].lower() == "/pm":
        if len(splitted) < 3:
            socketio.emit("pm_fail", vals[1])
        else:
            pmid = splitted[1]
            if int(pmid) in players:
                newvals = [" ".join(splitted[2:]), splitted[1], vals[1], vals[2]]
                socketio.emit("private_msg", newvals)
            else:
                socketio.emit("pm_fail", vals[1])
    else:
        socketio.emit("append_msg", vals)

def on_debug(data):
    print(data)

def on_player_hit(player_id, players, socketio):
    if int(player_id) in players:
        players[int(player_id)].decrease_hp(2)
        socketio.emit("render_players", {pid: player.to_dict() for pid, player in players.items()})
    for key in players:
        print(key)
        print(players[key].hp)
