# NextRealm

## Getting started
* ui layer
  * install nodejs
  * `npm install`
  * Use `yarn install` if `npm install` does not work
  * If `npm install` doesn't work and yarn is not found, run `npm install -g yarn` then run `yarn install`
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

Here’s everything reliant on Python in your workspace that needs to be replaced or rewritten in Rust:

1. Python Code
Files:
main.py
socket_events.py
player.py
monster.py
assets_blueprint.py
testrunner.py
Purpose: Flask app, WebSocket handling, game logic, and testing.
Replacement: Use Rust frameworks like Actix Web for HTTP/WebSocket and Tokio for async tasks.
2. Python Dependencies
File: requirements.txt
Dependencies: Flask, Flask-SocketIO, pytest, unittest-xml-reporting, coverage.
Replacement: Use Rust equivalents:
Flask → Actix Web or Rocket.
Flask-SocketIO → tokio-tungstenite or warp.
Testing → Rust's built-in test framework or criterion for benchmarks.
3. Docker
File: Dockerfile.tests
Purpose: Python-based testing container.
Replacement: Use a Rust-based Dockerfile:
4. JSON Data
Files:
data/mons.json
data/users.json
Purpose: Game data for monsters and players.
Replacement: Use serde_json in Rust for parsing and serialization.
5. Flask Templates
Files:
templates/index.html
templates/game.html
Purpose: HTML templates rendered by Flask.
Replacement: Use Tera or Askama for Rust-based template rendering.
6. Python-Specific Testing
Files:
testrunner.py
Dockerfile.tests
Purpose: Python-based test runner and coverage tools.
Replacement: Use Rust's cargo test and tarpaulin for test coverage.
7. Environment Variables
Usage: os.getenv in Python for configuration.
Replacement: Use Rust's std::env or dotenv.
8. Python-Specific Libraries
Examples: time, math, json, os.
Replacement: Use Rust's standard library or crates like chrono (time), serde_json (JSON), and std::fs (file handling).
9. Python-Specific Syntax
Examples: Dynamic typing, list comprehensions, global variables.
Replacement: Use Rust's strong typing, iterators, and scoped variables.
10. Debugging
Current: debugpy for remote debugging.
Replacement: Use gdb or VSCode Rust debugging.
This covers all Python dependencies and components in your workspace. Let me know if you need help with specific migrations!