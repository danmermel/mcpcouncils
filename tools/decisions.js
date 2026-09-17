import * as z from 'zod/v4';
import { apiGet } from '../api-client.js';
import { jsonResult } from '../util.js';

export function registerDecisionTools(server) {
  server.registerTool(
    'list_decisions',
    {
      description:
        'List council decisions. Supports filtering by council, date range and whether a decision is flagged as a "key decision". Paginated.',
      inputSchema: z.object({
        council_id: z.number().int().optional().describe('Filter to a specific council'),
        date_from: z.string().optional().describe('ISO date (YYYY-MM-DD), inclusive lower bound'),
        date_to: z.string().optional().describe('ISO date (YYYY-MM-DD), inclusive upper bound'),
        is_key: z.boolean().optional().describe('Only return key decisions (or only non-key decisions)'),
        page: z.number().int().min(1).optional().default(1),
        per_page: z.number().int().min(1).max(100).optional().default(25),
      }),
    },
    async (params) => jsonResult(await apiGet('/decisions', params))
  );

  server.registerTool(
    'get_decision',
    {
      description:
        'Get full detail for a single decision, including its outcome, purpose, content and any attached documents.',
      inputSchema: z.object({
        decision_id: z.number().int().describe('The decision ID'),
      }),
    },
    async ({ decision_id }) => jsonResult(await apiGet(`/decisions/${decision_id}`))
  );
}
