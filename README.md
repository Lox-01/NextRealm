# NextRealm

Since I (Lox) am back, here's a list of things (for me) to do!

~~1. Verify the current functionality of what we have in the main branch:~~
  - ~~Movement~~
  - ~~Damage mechanics~~
  - ~~Chat~~
  - ~~Private Messaging~~
  - ~~Anything else?~~

2. For the following branches verify the same functionality, and whatever they added works, then merge:
   - ~~cooldowns~~
   - damage-text
   - chat-ui

3. Update the Silly Development files using the panel I'm working on.

4. Create a new branch for work on the mobs!
   What does a mob need?
   - A name
   - Health
   - An attack (will need range, strength, whatever else but for now this will be good)
   - Attack cooldown
   - An origin (home coordinates)
   - A range to follow hostiles from the home coordinates
   - A model (cube for now)
   - A speed and other stats

5. We will need a file to keep track of all of the mobs in the game.
   - JSON file
   - **Not** live-updated (so we don't update the HP of monsters as they are attacked in the JSON file, it's just permanent data)
   - The format for information for a mob will be like this:
     - {"name":"xyz", "health": 50, "attack": 50, "origin": [1234,5678,90], "range": 50, "speed": 1}

6. Fix the player and all the other stuff / data to use a dictionary instead of a list.
   I.e. instead of [1, 2, 3, 4] and then accessing stuff based on position (list[0]) change it to {"name": 1, "x": 2} etc. and access based on key (list["name"]).
