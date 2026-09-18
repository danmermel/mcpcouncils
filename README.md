# Locally hosted MCP server for Council Data

This project allows you to run a locally hosted MCP server that uses the data available at https://councilgateway.poteris.co.uk/council-api/docs.

## Installation

Clone the project into your directory and cd into it.

Install the node packages with
```sh
npm install
```

## Running with Claude Desktop client

In Settings->Developer , click on "Edit Config".
Add the following to the config document:

```json
"mcpServers": {
    "councils": {
      "command": "/full/path/to/project/run.sh"
    }
  },
  ```
(shell script just ensures that Claude Desktop is in the right directory when trying to start the MCP server)

You should be able to ask Claude to fetch you a list of councils using the "councils" MCP service.

## Testing with mcptools

Install the [mcptools command line tool](https://github.com/f/mcptools).

In the root of the project start an interactive shell with

```sh
mcptools shell npm run start

#mcp > 
```

You can then issue commands like

```sh
tools #get a list of available tools
```

```sh
list_councils #get a list of councils
```