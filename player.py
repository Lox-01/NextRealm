from character import Character

class Player(Character):
    def __init__(self, id, position, rotation, hp, name, totalhp):
        super().__init__(id, position, rotation, hp, totalhp, name)