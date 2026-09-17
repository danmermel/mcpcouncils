import * as z from 'zod/v4';
import { apiGet } from '../api-client.js';
import { jsonResult } from '../util.js';

export function registerCouncilTools(server) {
  server.registerTool(
    'list_councils',
    {
      description: 'List councils. Can be filtered by council type. Paginated.',
      inputSchema: z.object({
        council_type: z.string().optional().describe('Filter by council type'),
        page: z.number().int().min(1).optional().default(1),
        per_page: z.number().int().min(1).max(100).optional().default(25),
      }),
    },
    async (params) => jsonResult(await apiGet('/councils', params))
  );

  server.registerTool(
    'get_council',
    {
      description: 'Get full detail for a single council.',
      inputSchema: z.object({
        council_id: z.number().int().describe('The council ID'),
      }),
    },
    async ({ council_id }) => jsonResult(await apiGet(`/councils/${council_id}`))
  );

  server.registerTool(
    'list_council_committees',
    {
      description: 'List the committees belonging to a council. Paginated.',
      inputSchema: z.object({
        council_id: z.number().int().describe('The council ID'),
        page: z.number().int().min(1).optional().default(1),
        per_page: z.number().int().min(1).max(100).optional().default(25),
      }),
    },
    async ({ council_id, ...params }) => jsonResult(await apiGet(`/councils/${council_id}/committees`, params))
  );
}
