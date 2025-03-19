from character import Character

class Player(Character):
    def __init__(self, id, position, rotation, hp, name, totalhp):
        super().__init__(id, position, rotation, hp, totalhp, name)

    def to_dict(self):
        base_dict = super().to_dict()
        return base_dict
