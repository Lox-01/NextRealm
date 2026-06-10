import math
import time

from character import Character


class Monster(Character):
    def __init__(
        self,
        name,
        hp,
        totalhp,
        attack,
        arange,
        cooldown,
        origin,
        rotation,
        aggrorange,
        followrange,
        speed,
        id,
        modelpath,
    ):
        super().__init__(
            id, origin.copy(), rotation.copy(), hp, totalhp, name, modelpath
        )
        self.attack = attack
        self.arange = arange
        self.cooldown = cooldown
        self.origin = origin
        self.orotation = rotation
        self.aggrorange = aggrorange
        self.followrange = followrange
        self.speed = speed
        self.target = None
        self.threats = {}
        self.dead_at = None

    def is_in_arange(self, player):
        return self.arange >= math.sqrt(
            (self.position["x"] - player.position["x"]) ** 2
            + (self.position["y"] - player.position["y"]) ** 2
            + (self.position["z"] - player.position["z"]) ** 2
        )

    def is_in_aggrorange(self, player):
        return self.aggrorange >= math.sqrt(
            (self.position["x"] - player.position["x"]) ** 2
            + (self.position["y"] - player.position["y"]) ** 2
            + (self.position["z"] - player.position["z"]) ** 2
        )

    def is_in_followrange(self):
        return self.followrange >= math.sqrt(
            (self.origin["x"] - self.position["x"]) ** 2
            + (self.origin["y"] - self.position["y"]) ** 2
            + (self.origin["z"] - self.position["z"]) ** 2
        )

    def decay_threat(self, player):
        if player.id in self.threats:
            curr = time.time()
            for player_id, threat_time in list(self.threats.items()):
                if curr - threat_time[1] > 2:
                    self.threats[player_id][0] = round(
                        self.threats[player_id][0] - 0.2, 2
                    )
                if self.threats[player_id][0] <= 0:
                    del self.threats[player_id]

    def move_to_origin(self):
        direction = {
            axis: self.origin[axis] - self.position[axis] for axis in ["x", "y", "z"]
        }
        distance = math.sqrt(sum(direction[axis] ** 2 for axis in direction))
        if distance > 0:
            norm = distance
            for axis in direction:
                direction[axis] /= norm
                self.position[axis] += direction[axis] * self.speed
            self.rotation["yr"] = math.atan2(direction["x"], direction["z"])
            self.rotation["xr"] = math.atan2(
                direction["y"], math.hypot(direction["x"], direction["z"])
            )
            if distance <= self.speed:
                self.position = self.origin.copy()
                self.rotation = self.orotation.copy()

    def move_to_player(self, player):
        direction = {
            axis: player.position[axis] - self.position[axis]
            for axis in ["x", "y", "z"]
        }
        distance = math.sqrt(sum(direction[axis] ** 2 for axis in direction))
        if distance > 0:
            norm = distance
            for axis in direction:
                direction[axis] /= norm
                self.position[axis] += direction[axis] * self.speed
            self.rotation["yr"] = math.atan2(direction["x"], direction["z"])
            self.rotation["xr"] = math.atan2(
                direction["y"], math.hypot(direction["x"], direction["z"])
            )
            if distance <= self.speed:
                self.position = player.position.copy()
                self.rotation = player.rotation.copy()

    def turn_to_player(self, player):
        direction = {
            axis: player.position[axis] - self.position[axis]
            for axis in ["x", "y", "z"]
        }
        self.rotation["yr"] = math.atan2(direction["x"], direction["z"])
        self.rotation["xr"] = math.atan2(
            direction["y"], math.hypot(direction["x"], direction["z"])
        )

    def try_respawn(self, socketio):
        if self.dead_at and round(time.time()) - self.dead_at >= 15:
            self.dead_at = None
            self.hp = self.totalhp
            self.alive = True
            self.position = self.origin.copy()
            self.rotation = self.orotation.copy()
            socketio.emit("monster_position_update", self.to_dict())

    def to_dict(self):
        base_dict = super().to_dict()
        base_dict.update(
            {
                "attack": self.attack,
                "arange": self.arange,
                "cooldown": self.cooldown,
                "origin": self.origin,
                "aggrorange": self.aggrorange,
                "followrange": self.followrange,
                "speed": self.speed,
                "threats": self.threats,
                "modelpath": self.modelpath,
            }
        )
        return base_dict
