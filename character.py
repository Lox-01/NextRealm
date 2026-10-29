class Character:
    def __init__(self, id, position, rotation, hp, totalhp, name, modelpath):
        self.id = id
        self.hp = hp
        self.totalhp = totalhp
        self.position = position
        self.rotation = rotation
        self.alive = not hp <= 0
        self.name = name
        self.last_hit = None
        self.modelpath = modelpath

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
            "alive": self.alive,
            "name": self.name,
            "modelpath": self.modelpath,
        }
