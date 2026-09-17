import * as z from 'zod/v4';
import { apiGet } from '../api-client.js';
import { jsonResult } from '../util.js';

export function registerSearchTools(server) {
  server.registerTool(
    'search',
    {
      description:
        'Full-text search over the council data (OpenSearch-backed). Mode "document" searches document text; mode "classification" searches extracted classification output. Returns scored hits with highlights.',
      inputSchema: z.object({
        q: z.string().min(2).describe('Search query, minimum 2 characters'),
        council_id: z.number().int().optional().describe('Restrict results to a specific council'),
        mode: z.enum(['document', 'classification']).optional().default('document'),
        size: z.number().int().min(1).max(100).optional().default(20).describe('Number of hits to return'),
        offset: z.number().int().min(0).optional().default(0).describe('Offset for pagination'),
      }),
    },
    async (params) => jsonResult(await apiGet('/search', params))
  );
}
