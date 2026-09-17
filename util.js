/**
 * Wrap a JSON-serializable value as MCP tool content.
 */
export function jsonResult(data) {
  return {
    content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
  };
}
