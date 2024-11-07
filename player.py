class Player:
    def __init__(self, id, position, rotation, hp):
        self.id       = id
        self.hp       = hp
        self.position = position
        self.rotation = rotation

    def update_position(self, pos):
        self.position.update(pos)

    def update_rotation(self, rot):
        self.rotation.update(rot)

    def decrease_hp(self, amount):
        self.hp = max(0,self.hp - amount)

    def to_dict(self):
        return {
            "id"       : self.id,
            "hp"       : self.hp,
            "position" : self.position,
            "rotation" : self.rotation
        }