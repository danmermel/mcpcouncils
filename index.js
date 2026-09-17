import { McpServer } from '@modelcontextprotocol/server';
import { serveStdio } from '@modelcontextprotocol/server/stdio';

import { registerCouncilTools } from './tools/councils.js';
import { registerMeetingTools } from './tools/meetings.js';
import { registerDocumentTools } from './tools/documents.js';
import { registerDecisionTools } from './tools/decisions.js';
import { registerPeopleTools } from './tools/people.js';
import { registerSearchTools } from './tools/search.js';

function createServer() {
  const server = new McpServer({ name: 'council-gateway', version: '1.0.0' });

  registerCouncilTools(server);
  registerMeetingTools(server);
  registerDocumentTools(server);
  registerDecisionTools(server);
  registerPeopleTools(server);
  registerSearchTools(server);

  return server;
}

serveStdio(createServer);

// stdout is the JSON-RPC channel — never console.log here, only console.error.
console.error('council-gateway MCP server running on stdio');
