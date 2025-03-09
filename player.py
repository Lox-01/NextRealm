from character import Character

class Player(Character):
    def __init__(self, id, position, rotation, hp, username, totalhp):
        super().__init__(id, position, rotation, hp, totalhp)
        self.username = username
        self.last_hit = None

    def to_dict(self):
        base_dict = super().to_dict()
        base_dict.update({
            "username": self.username
        })
        return base_dict
