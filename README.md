# NextRealm

The current structure is as follows:
Python files for the backend
-- main.py is the main runner file.
-- player.py contains the player class.
-- socket_events.py contains the socket events (I can't describe it better than this, sorry).
A "templates" folder containing HTML files to be rendered.
-- index.html is the game page right now.
A "data" folder that will contain JSON files and other data things.
-- data.json will be where we store player states for when they go offline, and then when they go online it will fetch their old data and put them back to where they were.
A "static" folder which contains javascript files (for the frontend logic), css files as needed and the logo. Probably other stuff later for the frontend.
-- NextRealm.jpg is self-explanatory
-- style.css is the... style lol.
-- utils.js contains a few helper functions which we might use.
-- script.js is the game's script for the game page handling like connections disconnections movement rendering etc.
And a README.md file, which is this.
