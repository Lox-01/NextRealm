class Monster:
    def __init__(self, name, hp, totalhp, attack, arange, cooldown, origin, position, rotation, aggrorange, followrange, speed):
        self.name = name
        self.hp = hp
        self.totalhp = totalhp
        self.attack = attack
        self.arange = arange
        self.cooldown = cooldown
        self.origin = origin
        self.position = position
        self.rotation = rotation
        self.aggrorange = aggrorange
        self.followrange = followrange
        self.speed = speed
        self.last_hit = None
        self.target = None

    def update_position(self, pos):
        self.position.update(pos)

    def update_rotation(self, rot):
        self.rotation.update(rot)

    def decrease_hp(self, amount):
        self.hp = max(0,self.hp - amount)

    def to_dict(self):
        return {
            "name"         :   self.name,
            "hp"           :   self.hp,
            "totalhp"      :   self.totalhp,
            "attack"       :   self.attack,
            "arange"       :   self.arange,
            "cooldown"     :   self.cooldown,
            "origin"       :   self.origin,
            "pos"          :   self.position,
            "rot"          :   self.rotation,
            "aggrorange"   :   self.aggrorange,
            "followrange"  :   self.followrange,
            "speed"        :   self.speed
        }