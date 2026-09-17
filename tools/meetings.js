import * as z from 'zod/v4';
import { apiGet } from '../api-client.js';
import { jsonResult } from '../util.js';

export function registerMeetingTools(server) {
  server.registerTool(
    'list_meetings',
    {
      description:
        'List council meetings. Supports filtering by council, committee, date range and whether minutes are available. Paginated.',
      inputSchema: z.object({
        council_id: z.number().int().optional().describe('Filter to a specific council'),
        committee_id: z.number().int().optional().describe('Filter to a specific committee'),
        date_from: z.string().optional().describe('ISO date (YYYY-MM-DD), inclusive lower bound'),
        date_to: z.string().optional().describe('ISO date (YYYY-MM-DD), inclusive upper bound'),
        has_minutes: z.boolean().optional().describe('Only return meetings that do/do not have minutes'),
        page: z.number().int().min(1).optional().default(1),
        per_page: z.number().int().min(1).max(100).optional().default(25),
      }),
    },
    async (params) => jsonResult(await apiGet('/meetings', params))
  );

  server.registerTool(
    'get_meeting',
    {
      description:
        'Get full detail for a single meeting, including its committee, attendees, tags, documents and decisions.',
      inputSchema: z.object({
        meeting_id: z.number().int().describe('The meeting ID'),
      }),
    },
    async ({ meeting_id }) => jsonResult(await apiGet(`/meetings/${meeting_id}`))
  );
}
