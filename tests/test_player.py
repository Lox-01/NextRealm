# //python
import unittest
from character import Character
from player import Player

class TestPlayer(unittest.TestCase):

    def test_player_init_valid(self):
        player = Player(1, (10, 20), 90, 100, "player_one", 200)
        self.assertEqual(player.id, 1)
        self.assertEqual(player.position, (10, 20))
        self.assertEqual(player.rotation, 90)
        self.assertEqual(player.hp, 100)
        self.assertEqual(player.name, "player_one")
        self.assertEqual(player.totalhp, 200)
        self.assertIsNone(player.last_hit)

    def test_player_dict_representation(self):
        player = Player(2, (15, 25), 45, 120, "player_two", 240)
        expected_dict = {'id': 2, 'hp': 120, 'totalhp': 240, 'pos': (15, 25), 'rot': 45, 'name': 'player_two'}
        self.assertEqual(player.to_dict(), expected_dict)

    # def test_invalid_id_type(self):
    #     with self.assertRaises(TypeError):
    #         player = Player("one", (10, 20), 90, 100, "player_one", 200)

    # def test_invalid_position_type(self):
    #     with self.assertRaises(TypeError):
    #         player = Player(1, "10, 20", 90, 100, "player_one", 200)

    # def test_invalid_rotation_type(self):
    #     with self.assertRaises(TypeError):
    #         player = Player(1, (10, 20), "90", 100, "player_one", 200)

    # def test_invalid_hp_type(self):
    #     with self.assertRaises(AttributeError):
    #         player = Player(1, (10, 20), 90, "100", "player_one", 200)

    # def test_invalid_username_type(self):
    #     with self.assertRaises(TypeError):
    #         player = Player(1, (10, 20), 90, 100, 100, 200)

    # def test_invalid_totalhp_type(self):
    #     with self.assertRaises(TypeError):
    #         player = Player(1, (10, 20), 90, 100, "player_one", "200")

    def test_negative_hp(self):
        player = Player(1, (10, 20), 90, -50, "player_one", 200)
        self.assertEqual(player.hp, -50)

    def test_zero_hp(self):
        player = Player(1, (10, 20), 90, 0, "player_one", 200)
        self.assertEqual(player.hp, 0)

    def test_to_dict_after_damage(self):
        player = Player(1, (10, 20), 90, 100, "player_one", 200)
        player.hp -= 50  # Simulating damage
        updated_dict = player.to_dict()
        expected_dict = {
            'id': 1,
            'pos': (10, 20),
            'rot': 90,
            'hp': 50,
            'totalhp': 200,
            'username': 'player_one'
        }
        self.assertEqual(updated_dict, expected_dict)

if __name__ == "__main__":
    unittest.main()
# //