import * as z from 'zod/v4';
import { apiGet, apiGetResource } from '../api-client.js';
import { jsonResult } from '../util.js';

export function registerDocumentTools(server) {
  server.registerTool(
    'list_documents',
    {
      description:
        'List documents (agendas, minutes, reports, media, etc). Can be filtered by meeting, decision, council, kind or processing status. Paginated.',
      inputSchema: z.object({
        meeting_id: z.number().int().optional().describe('Filter to documents attached to a meeting'),
        decision_id: z.number().int().optional().describe('Filter to documents attached to a decision'),
        council_id: z.number().int().optional().describe('Filter to a specific council'),
        is_minutes: z.boolean().optional().describe('Only return documents that are (or are not) minutes'),
        kind: z.string().optional().describe('Document kind, e.g. "agenda", "minutes", "report"'),
        processing_status: z.string().optional().describe('Filter by extraction/processing status'),
        page: z.number().int().min(1).optional().default(1),
        per_page: z.number().int().min(1).max(100).optional().default(25),
      }),
    },
    async (params) => jsonResult(await apiGet('/documents', params))
  );

  server.registerTool(
    'get_document',
    {
      description:
        'Get full detail for a single document. Set include_text to true to also return the extracted text content (e.g. minutes text) — this can be large.',
      inputSchema: z.object({
        document_id: z.number().int().describe('The document ID'),
        include_text: z.boolean().optional().default(false).describe('Include extracted text content'),
      }),
    },
    async ({ document_id, include_text }) =>
      jsonResult(await apiGet(`/documents/${document_id}`, { include_text }))
  );

  server.registerTool(
    'list_document_classifications',
    {
      description:
        'List the AI-generated classifications produced for a document (model used, structured output). Paginated.',
      inputSchema: z.object({
        document_id: z.number().int().describe('The document ID'),
        page: z.number().int().min(1).optional().default(1),
        per_page: z.number().int().min(1).max(100).optional().default(25),
      }),
    },
    async ({ document_id, ...params }) =>
      jsonResult(await apiGet(`/documents/${document_id}/classifications`, params))
  );

  server.registerTool(
    'get_document_file',
    {
      description:
        'Get the location of the underlying document file (e.g. a PDF). Returns the resolved URL and content type rather than the raw file bytes — the file itself is usually binary and not useful to a model directly. Set redirect to false to get the raw redirect target instead of following it.',
      inputSchema: z.object({
        document_id: z.number().int().describe('The document ID'),
        redirect: z.boolean().optional().default(true).describe('Follow the redirect to the file'),
      }),
    },
    async ({ document_id, redirect }) =>
      jsonResult(await apiGetResource(`/documents/${document_id}/file`, { redirect }))
  );
}
