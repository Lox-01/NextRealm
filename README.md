# NextRealm

Branches and changes to implement:
- 0.1.0-Mob-Madness
  - "Monster" attacks when player is within the arange.
  - "Monster" begins to follow the player when the player is within the aggro range of the origin.
  - "Monster" ceases following and returns to origin when the monster leaves the followrange from the origin.

## Getting started
* ui layer
  * install nodejs
  * `npm install`
  * `npm run watch`
* python
  * docker: 
    * install [docker](https://docs.docker.com/get-started/get-docker/)
    * run script `sh scripts\run-docker-with-retry.sh` or vscode debugger "Python: Docker Remote Attach".
    * you can run unit tests using vscode debugger "Python: Test Docker Remote Attach".
  * venv
    * Create a Python virtual environment then install the Pip dependencies.
      ```sh
      python3 -m venv .venv
      source .venv/bin/activate
      pip install -r requirements.txt
      ```
      ```ps1
      python -m venv .venv
      .venv/Scripts/Activate.ps1
      pip install -r requirements.txt
      ```
    * Make sure you have the Python extension installed in VS Code. You can find it in the Extensions Marketplace.
    * Open the Command Palette (Ctrl+Shift+P or Cmd+Shift+P on macOS) and type Python: Select Interpreter
    * vscode debugger "Python Debugger: Current File".