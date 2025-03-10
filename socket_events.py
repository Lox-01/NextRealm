from flask_socketio import emit
from player import Player
from datetime import datetime, timedelta
import json, os, time

def on_connect(socketio, player_id, players, mons):
    if os.path.exists("./data/users.json"):
        users=json.load(open('./data/users.json'))
    elif os.path.exists("./NextRealm/data/users.json"):
        users=json.load(open('./NextRealm/data/users.json'))
    username_save = None
    user = None
    for username in users:
        if users[username]['id'] == int(player_id):
            user = users[username]
            username_save = username
    players[int(player_id)] = Player(int(player_id), user['pos'], user['rot'], user['hp'], str(username_save), user['totalhp'])
    socketio.emit("render_players", {pid: player.to_dict() for pid, player in players.items()})
    socketio.emit("render_monsters", {pid: monster.to_dict() for pid, monster in mons.items()})

def on_offline(player_id, players, socketio, client_id, client_ids, monsters):
    if os.path.exists("./data/users.json"):
        users=json.load(open('./data/users.json'))
    elif os.path.exists("./NextRealm/data/users.json"):
        users=json.load(open('./NextRealm/data/users.json'))
    player_id = int(player_id)
    for username in users:
        if users[username]['id'] == player_id:
            users[username] = {"id": players[player_id].id, "pos": players[player_id].position, "rot": players[player_id].rotation, "hp": players[player_id].hp, "totalhp": players[player_id].totalhp}
    if os.path.exists("./data/users.json"):
        json.dump(users, open("./data/users.json", "w"), indent = 2)
    elif os.path.exists("./NextRealm/data/users.json"):
        json.dump(users, open("./NextRealm/data/users.json", "w"), indent = 2)
    if player_id in players:
        del players[player_id]
    if client_id in client_ids:
        client_ids.remove(client_id)
    for monster in monsters.values():
        if player_id in monster.threats:
            del monster.threats[player_id]
    socketio.emit("render_players", {pid: player.to_dict() for pid, player in players.items()})

def on_player_move(data, players, socketio):
    player_id = int(data["id"])
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
            usern = splitted[1]
            if str(usern) in [player.username for player in players.values()]:
                newvals = [" ".join(splitted[2:]), usern, vals[1]]
                socketio.emit("private_msg", newvals)
            else:
                socketio.emit("pm_fail", vals[1])
    else:
        socketio.emit("append_msg", vals)

def on_debug(data):
    print(data)

def process_hit(hit, hitter, socketio, entity_type, entity_dict):
    d = datetime.now()
    if hitter.last_hit:
        if d - hitter.last_hit >= timedelta(seconds=1):
            hit.decrease_hp(2)
            hitter.last_hit = d
            if hit.hp <= 0 and hit.alive:
                if entity_type == "player":
                    socketio.emit("player_dead", hit.to_dict())
                else:
                    socketio.emit("monster_dead", hit.to_dict())
                hit.alive = False
            else:
                if entity_type == "player":
                    socketio.emit("render_players", {pid: player.to_dict() for pid, player in entity_dict.items()})
                else:
                    socketio.emit("render_monsters", {pid: monster.to_dict() for pid, monster in entity_dict.items()})
            time.sleep(1)
            socketio.emit("refresh_spell", [hitter.id, 1])
    else:
        hit.decrease_hp(2)
        hitter.last_hit = d
        if hit.hp <= 0 and hit.alive:
            if entity_type == "player":
                socketio.emit("player_dead", hit.to_dict())
            else:
                socketio.emit("monster_dead", hit.to_dict())
            hit.alive = False
        else:
            if entity_type == "player":
                socketio.emit("render_players", {pid: player.to_dict() for pid, player in entity_dict.items()})
            else:
                socketio.emit("render_monsters", {pid: monster.to_dict() for pid, monster in entity_dict.items()})
        time.sleep(1)
        socketio.emit("refresh_spell", [hitter.id, 1])

def on_player_hit(hittertype, player_id, players, socketio, hitter_id, monsters, targettype):
    if hittertype == "player":
        if targettype == "player":
            if int(player_id) in players and int(hitter_id) in players:
                hit = players[int(player_id)]
                hitter = players[int(hitter_id)]
                process_hit(hit, hitter, socketio, "player", players)
        elif targettype == "monster":
            if str(player_id) in monsters and int(hitter_id) in players:
                hit = monsters[str(player_id)]
                hitter = players[int(hitter_id)]
                if int(hitter_id) in hit.threats:
                    hit.threats[int(hitter_id)][0] += 2
                    hit.threats[int(hitter_id)][1] = time.time()
                process_hit(hit, hitter, socketio, "monster", monsters)
    else:
        if int(player_id) in players and str(hitter_id) in monsters:
            hit = players[int(player_id)]
            hitter = monsters[str(hitter_id)]
            process_hit(hit, hitter, socketio, "player", players)

def on_respawn(players, id, socketio):
    if int(id) in players:
        players[int(id)].position = {"x":0,"y":0,"z":0}
        players[int(id)].rotation = {"xr":0,"yr":0,"zr":0}
        players[int(id)].hp = players[int(id)].totalhp
        socketio.emit("render_players", {pid: player.to_dict() for pid, player in players.items()})