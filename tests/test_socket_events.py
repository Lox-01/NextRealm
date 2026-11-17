import unittest

from character import Character
from socket_events import on_new_msg


class FakeSocket:
    def __init__(self):
        self.events = []

    def emit(self, event, data):
        self.events.append((event, data))


class TestSocketMessages(unittest.TestCase):
    def setUp(self):
        self.socket = FakeSocket()
        self.player = Character(1, {"x": 0, "y": 0, "z": 0}, {"xr": 0, "yr": 0, "zr": 0}, 10, 10, "alice", "player.glb")
        self.players = {1: self.player}

    def test_private_message(self):
        on_new_msg(["/pm alice hello there", "bob"], self.players, self.socket)
        self.assertEqual(self.socket.events, [("private_msg", ["hello there", "alice", "bob"])])

    def test_private_message_requires_body(self):
        on_new_msg(["/pm alice", "bob"], self.players, self.socket)
        self.assertEqual(self.socket.events, [("pm_fail", "bob")])

    def test_empty_message_is_ignored(self):
        on_new_msg(["   ", "bob"], self.players, self.socket)
        self.assertEqual(self.socket.events, [])

    def test_public_message(self):
        on_new_msg(["hello", "bob"], self.players, self.socket)
        self.assertEqual(self.socket.events, [("append_msg", ["hello", "bob"])])


if __name__ == "__main__":
    unittest.main()
