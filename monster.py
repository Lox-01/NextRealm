import math
import time
from character import Character

class Monster(Character):
    def __init__(self, name, hp, totalhp, attack, arange, cooldown, origin, rotation, aggrorange, followrange, speed, id):
        super().__init__(id, origin.copy(), rotation, hp, totalhp)
        self.name = name
        self.attack = attack
        self.arange = arange
        self.cooldown = cooldown
        self.origin = origin
        self.aggrorange = aggrorange
        self.followrange = followrange
        self.speed = speed
        self.last_hit = None
        self.target = None
        self.threats = {}

    def is_in_arange(self, player):
        return self.arange >= math.sqrt((self.position["x"] - player.position["x"])**2 + (self.position["y"] - player.position["y"])**2 + (self.position["z"] - player.position["z"])**2)

    def is_in_aggrorange(self, player):
        return self.aggrorange >= math.sqrt((self.position["x"] - player.position["x"])**2 + (self.position["y"] - player.position["y"])**2 + (self.position["z"] - player.position["z"])**2)

    def is_in_followrange(self):
        return self.followrange >= math.sqrt((self.origin["x"] - self.position["x"])**2 + (self.origin["y"] - self.position["y"])**2 + (self.origin["z"] - self.position["z"])**2)

    def attack_player(self, player):
        player.decrease_hp(self.attack)

    def decay_threat(self, player):
        if player.id in self.threats:
            curr = time.time()
            for player_id, threat_time in list(self.threats.items()):
                if curr - threat_time[1] > 2:
                    self.threats[player_id][0] = round(self.threats[player_id][0] - 0.2, 2)
                if self.threats[player_id][0] <= 0:
                    del self.threats[player_id]

    def move_to_origin(self):
        direction = {"x": self.origin["x"] - self.position["x"],"y": self.origin["y"] - self.position["y"],"z": self.origin["z"] - self.position["z"]}
        distance = math.sqrt(direction["x"]**2 + direction["y"]**2 + direction["z"]**2)
        if distance > 0:
            norm = math.sqrt(direction["x"]**2 + direction["y"]**2 + direction["z"]**2)
            direction["x"] /= norm
            direction["y"] /= norm
            direction["z"] /= norm
            self.position["x"] += direction["x"] * self.speed
            self.position["y"] += direction["y"] * self.speed
            self.position["z"] += direction["z"] * self.speed
            if distance <= self.speed:
                self.position = self.origin.copy()

    def to_dict(self):
        base_dict = super().to_dict()
        base_dict.update({
            "name": self.name,
            "attack": self.attack,
            "arange": self.arange,
            "cooldown": self.cooldown,
            "origin": self.origin,
            "aggrorange": self.aggrorange,
            "followrange": self.followrange,
            "speed": self.speed,
            "threats": self.threats
        })
        return base_dict
