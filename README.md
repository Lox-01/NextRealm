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
