# NextRealm

Branches and changes to implement:
- 0.1.0-Mob-Madness
  - "Monster" attacks when player is within the arange.
  - "Monster" begins to follow the player when the player is within the aggro range of the origin.
  - "Monster" ceases following and returns to origin when the monster leaves the followrange from the origin.

## Getting started
* install [docker](https://docs.docker.com/get-started/get-docker/)
* run script `sh scripts\run-docker-with-retry.sh` or vscode debugger "Python: Docker Remote Attach".
* you can run unit tests using vscode debugger "Python: Test Docker Remote Attach".
* install nodejs. `npm install` and `npm run build`