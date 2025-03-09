# //python
import unittest

def add_numbers(a, b):
    return a + b

def subtract_numbers(a, b):
    return a - b

class TestMathFunctions(unittest.TestCase):

    def test_add_numbers_positive(self):
        self.assertEqual(add_numbers(5, 3), 8)
        self.assertEqual(add_numbers(1, 1), 2)
        self.assertEqual(add_numbers(10, 30), 40)

    def test_add_numbers_negative(self):
        self.assertEqual(add_numbers(-5, -3), -8)
        self.assertEqual(add_numbers(-1, 0), -1)
        self.assertEqual(add_numbers(-1, 1), 0)

    def test_add_numbers_mixed(self):
        self.assertEqual(add_numbers(-10, 5), -5)
        self.assertEqual(add_numbers(15, -2), 13)

    def test_subtract_numbers_positive(self):
        self.assertEqual(subtract_numbers(10, 5), 5)
        self.assertEqual(subtract_numbers(3, 1), 2)
        self.assertEqual(subtract_numbers(20, 10), 10)

    def test_subtract_numbers_negative(self):
        self.assertEqual(subtract_numbers(-5, -3), -2)
        self.assertEqual(subtract_numbers(-10, 0), -10)
        self.assertEqual(subtract_numbers(-15, -5), -10)

    def test_subtract_numbers_mixed(self):
        self.assertEqual(subtract_numbers(5, -3), 8)
        self.assertEqual(subtract_numbers(-5, 3), -8)
        self.assertEqual(subtract_numbers(0, -5), 5)
        self.assertEqual(subtract_numbers(-5, 10), -15)

    def test_add_numbers_edge_cases(self):
        self.assertEqual(add_numbers(0, 0), 0)  
        self.assertEqual(add_numbers(add_numbers(0, 0), 0), 0)
        self.assertEqual(add_numbers(99999, 1), 100000)

    def test_subtract_numbers_edge_cases(self):
        self.assertEqual(subtract_numbers(0, 0), 0)
        self.assertEqual(subtract_numbers(1, 1), 0)
        self.assertEqual(subtract_numbers(100000, 99999), 1)

if __name__ == '__main__':
    unittest.main()
# //