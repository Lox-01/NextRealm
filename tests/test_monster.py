# //python
import unittest
from unittest.mock import patch
from character import Character
from monster import Monster
from random import randint
import math
import time

class TestMonster(unittest.TestCase):
    def setUp(self):
        self.monster = Monster(
            name="Goblin",
            hp=100,
            totalhp=150,
            attack=15,
            arange=20,
            cooldown=3,
            origin={'x': 0, 'y': 0, 'z': 0},
            rotation={'yr': 0, 'xr': 0},
            aggrorange=30,
            followrange=50,
            speed=5,
            id=123
        )
        self.player = Character(
            id=321,
            position={'x': 10, 'y': 10, 'z': 10},
            rotation={'yr': 90, 'xr': 0},
            hp=80,
            totalhp=80
        )

    def test_is_in_arange_true(self):
        self.assertTrue(self.monster.is_in_arange(self.player))
    
    def test_is_in_arange_false(self):
        self.player.position = {'x': 30, 'y': 30, 'z': 30}
        self.assertFalse(self.monster.is_in_arange(self.player))
        
    def test_is_in_aggrorange_true(self):
        self.assertTrue(self.monster.is_in_aggrorange(self.player))
    
    def test_is_in_aggrorange_false(self):
        self.player.position = {'x': 50, 'y': 50, 'z': 50}
        self.assertFalse(self.monster.is_in_aggrorange(self.player))
        
    def test_is_in_followrange_true(self):
        self.monster.position = {'x': 5, 'y': 5, 'z': 5}
        self.assertTrue(self.monster.is_in_followrange())
        
    def test_is_in_followrange_false(self):
        self.monster.position = {'x': 60, 'y': 60, 'z': 60}
        self.assertFalse(self.monster.is_in_followrange())
        
    def test_attack_player(self):
        initial_hp = self.player.hp
        self.monster.attack_player(self.player)
        self.assertEqual(self.player.hp, initial_hp - self.monster.attack)
        
    def test_decay_threat(self):
        self.player.decrease_hp = patch('character.Character.decrease_hp')
        self.monster.threats[self.player.id] = [1.0, time.time() - 3]
        self.monster.decay_threat(self.player)
        self.assertIn(self.player.id, self.monster.threats)
        
    def test_move_to_origin_not_moved(self):
        self.monster.move_to_origin()
        self.assertEqual(self.monster.position, self.monster.origin)
        self.assertEqual(self.monster.rotation, self.monster.orotation)
        
    def test_move_to_player(self):
        self.monster.move_to_player(self.player)
        # self.assertEqual(self.monster.position, self.player.position)
        # self.assertEqual(self.monster.rotation, self.player.rotation)
        
    def test_to_dict(self):
        result = {'id': 123, 'hp': 100, 'totalhp': 150, 'pos': {'x': 0, 'y': 0, 'z': 0}, 'rot': {'yr': 0, 'xr': 0}, 'name': 'Goblin', 'attack': 15, 'arange': 20, 'cooldown': 3, 'origin': {'x': 0, 'y': 0, 'z': 0}, 'aggrorange': 30, 'followrange': 50, 'speed': 5, 'threats': {}}
        self.assertEqual(self.monster.to_dict(), result)

if __name__ == '__main__':
    unittest.main()
# //