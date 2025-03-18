class Character:
    def __init__(self, id, position, rotation, hp, totalhp):
        self.id = id
        self.hp = hp
        self.totalhp = totalhp
        self.position = position
        self.rotation = rotation
        self.alive = False if hp <= 0 else True

    def update_position(self, pos):
        self.position.update(pos)

    def update_rotation(self, rot):
        self.rotation.update(rot)

    def decrease_hp(self, amount):
        self.hp = max(0, self.hp - amount)

    def to_dict(self):
        return {
            "id": self.id,
            "hp": self.hp,
            "totalhp": self.totalhp,
            "pos": self.position,
            "rot": self.rotation,
            "alive": self.alive
        }
