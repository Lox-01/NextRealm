import unittest
from character import Character


class TestCharacter(unittest.TestCase):

    def setUp(self):
        """Set up a Character instance for testing."""
        self.character = Character(
            id="char1",
            position={"x": 0, "y": 0, "z": 0},
            rotation={"xr": 0, "yr": 0, "zr": 0},
            hp=100,
            totalhp=150,
            name="TestCharacter",
            modelpath="/static/models/player.glb",
        )

    def test_update_position(self):
        """Test updating the position of the character."""
        new_position = {"x": 5, "y": 10, "z": -3}
        self.character.update_position(new_position)
        self.assertEqual(self.character.position, new_position)

    def test_update_rotation(self):
        """Test updating the rotation of the character."""
        new_rotation = {"xr": 45, "yr": 30, "zr": 90}
        self.character.update_rotation(new_rotation)
        self.assertEqual(self.character.rotation, new_rotation)

    def test_decrease_hp(self):
        """Test decreasing the character's HP."""
        self.character.decrease_hp(30)
        self.assertEqual(self.character.hp, 70)

        # Test decreasing HP below zero
        self.character.decrease_hp(100)
        self.assertEqual(self.character.hp, 0)

    def test_to_dict(self):
        """Test converting the character to a dictionary."""
        character_dict = self.character.to_dict()
        expected_dict = {
            "id": "char1",
            "hp": 100,
            "totalhp": 150,
            "pos": {"x": 0, "y": 0, "z": 0},
            "rot": {"xr": 0, "yr": 0, "zr": 0},
            "alive": True,
            "name": "TestCharacter",
            "modelpath": "/static/models/player.glb",
        }
        self.assertEqual(character_dict, expected_dict)


if __name__ == "__main__":
    unittest.main()
