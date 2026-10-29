import json
import math
import os
import time
from datetime import datetime, timedelta

from player import Player


def on_connect(socketio, player_id, players, mons):
    users = None
    if os.path.exists("./data/users.json"):
        with open("./data/users.json") as f:
            users = json.load(f)
    elif os.path.exists("./NextRealm/data/users.json"):
        with open("./NextRealm/data/users.json") as f:
            users = json.load(f)
    username_save = None
    user = None
    if users:
        for username in users:
            if users[username]["id"] == int(player_id):
                user = users[username]
                username_save = username
        if user:
            players[int(player_id)] = Player(
                int(player_id),
                user["pos"],
                user["rot"],
                user["hp"],
                str(username_save),
                user["totalhp"],
                user["modelpath"],
            )
            socketio.emit(
                "render_players",
                {pid: player.to_dict() for pid, player in players.items()},
            )
            socketio.emit(
                "render_monsters",
                {pid: monster.to_dict() for pid, monster in mons.items()},
            )


def on_offline(player_id, players, socketio, client_id, client_ids, monsters):
    users = None
    if os.path.exists("./data/users.json"):
        with open("./data/users.json") as f:
            users = json.load(f)
    elif os.path.exists("./NextRealm/data/users.json"):
        with open("./NextRealm/data/users.json") as f:
            users = json.load(f)
    player_id = int(player_id)
    if users:
        for username in users:
            if users[username]["id"] == player_id:
                users[username] = {
                    "id": players[player_id].id,
                    "pos": players[player_id].position,
                    "rot": players[player_id].rotation,
                    "hp": players[player_id].hp,
                    "totalhp": players[player_id].totalhp,
                    "modelpath": players[player_id].modelpath,
                }
        if os.path.exists("./data/users.json"):
            with open("./data/users.json", "w") as f:
                json.dump(users, f, indent=2)
        elif os.path.exists("./NextRealm/data/users.json"):
            with open("./NextRealm/data/users.json", "w") as f:
                json.dump(users, f, indent=2)
        if player_id in players:
            del players[player_id]
        if client_id in client_ids:
            client_ids.remove(client_id)
        for monster in monsters.values():
            if player_id in monster.threats:
                del monster.threats[player_id]
        socketio.emit(
            "render_players", {pid: player.to_dict() for pid, player in players.items()}
        )


def on_player_move(data, players, socketio):
    player_id = int(data["id"])
    keys = data["keys"]
    if player_id in players:
        player = players[player_id]
        if player.alive:
            moved = False
            a = player.rotation["yr"]
            if "w" in keys:
                b = math.sin(a) / 20
                c = math.cos(a) / 20
                player.position["z"] += c
                player.position["x"] += b
                moved = True
            if "s" in keys:
                b = -math.sin(a) / 40
                c = -math.cos(a) / 40
                player.position["z"] += c
                player.position["x"] += b
                moved = True
            if "q" in keys:
                a2 = a + math.pi / 2
                b = math.sin(a2) / 20
                c = math.cos(a2) / 20
                player.position["z"] += c
                player.position["x"] += b
                moved = True
            if "e" in keys:
                a2 = a - math.pi / 2
                b = math.sin(a2) / 20
                c = math.cos(a2) / 20
                player.position["z"] += c
                player.position["x"] += b
                moved = True
            if "a" in keys:
                player.rotation["yr"] += math.pi / 150
                moved = True
            if "d" in keys:
                player.rotation["yr"] -= math.pi / 150
                moved = True
            if moved:
                socketio.emit(
                    "render_players", {pid: p.to_dict() for pid, p in players.items()}
                )


def on_new_msg(vals, players, socketio):
    msg = vals[0]
    splitted = msg.split(" ")
    if splitted[0].lower() == "/pm":
        if len(splitted) < 3:
            socketio.emit("pm_fail", vals[1])
        else:
            usern = splitted[1]
            if str(usern) in [player.name for player in players.values()]:
                newvals = [" ".join(splitted[2:]), usern, vals[1]]
                socketio.emit("private_msg", newvals)
            else:
                socketio.emit("pm_fail", vals[1])
    else:
        socketio.emit("append_msg", vals)


def on_debug(data):
    print(data)


def process_hit(hit, hitter, socketio, entity_type, entity_dict):
    now = time.time()
    if not hasattr(hitter, "spell_cooldowns"):
        hitter.spell_cooldowns = {}
    spell_id = "1"
    cooldown = 2
    if not (hitter.alive and hit.alive):
        return
    d = datetime.now()

    should_hit = False
    if hitter.last_hit:
        if d - hitter.last_hit >= timedelta(seconds=1):
            should_hit = True
    else:
        should_hit = True

    if should_hit:
        hit.decrease_hp(2)
        hitter.last_hit = d
        if entity_type == "player":
            socketio.emit(
                "render_players",
                {pid: player.to_dict() for pid, player in entity_dict.items()},
            )
        else:
            socketio.emit(
                "render_monsters",
                {pid: monster.to_dict() for pid, monster in entity_dict.items()},
            )
        if hit.hp <= 0 and hit.alive:
            if entity_type == "player":
                socketio.emit("player_dead", hit.to_dict())
            else:
                socketio.emit("monster_dead", hit.to_dict())
                hit.dead_at = round(time.time())
            hit.alive = False

        def send_spell_ready():
            socketio.emit("spell_ready", [hitter.id, spell_id])

        socketio.start_background_task(
            lambda: (time.sleep(cooldown), send_spell_ready())
        )


def on_player_hit(
    hittertype, player_id, players, socketio, hitter_id, monsters, targettype
):
    if hittertype == "player":
        if targettype == "player":
            if int(player_id) in players and int(hitter_id) in players:
                hit = players[int(player_id)]
                hitter = players[int(hitter_id)]
                process_hit(hit, hitter, socketio, "player", players)
        elif (
            targettype == "monster"
            and str(player_id) in monsters
            and int(hitter_id) in players
        ):
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
        player = players[int(id)]
        player.position = {"x": 0, "y": 0, "z": 0}
        player.rotation = {"xr": 0, "yr": 0, "zr": 0}
        player.hp = players[int(id)].totalhp
        player.alive = True
        socketio.emit(
            "render_players", {pid: player.to_dict() for pid, player in players.items()}
        )
