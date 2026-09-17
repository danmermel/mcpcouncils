import * as z from 'zod/v4';
import { apiGet } from '../api-client.js';
import { jsonResult } from '../util.js';

export function registerPeopleTools(server) {
  server.registerTool(
    'list_people',
    {
      description:
        'List people (councillors and other officials). Supports filtering by council, whether they are a councillor, and party. Paginated.',
      inputSchema: z.object({
        council_id: z.number().int().optional().describe('Filter to a specific council'),
        is_councillor: z.boolean().optional().describe('Only return councillors (or only non-councillors)'),
        party: z.string().optional().describe('Filter by political party'),
        page: z.number().int().min(1).optional().default(1),
        per_page: z.number().int().min(1).max(100).optional().default(25),
      }),
    },
    async (params) => jsonResult(await apiGet('/people', params))
  );

  server.registerTool(
    'get_person',
    {
      description: 'Get full detail for a single person.',
      inputSchema: z.object({
        person_id: z.number().int().describe('The person ID'),
      }),
    },
    async ({ person_id }) => jsonResult(await apiGet(`/people/${person_id}`))
  );
}
