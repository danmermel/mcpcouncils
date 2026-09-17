const BASE_URL = process.env.COUNCIL_API_BASE_URL ?? 'https://councilgateway.poteris.co.uk/council-api';
const API_TOKEN = process.env.COUNCIL_API_TOKEN ?? ''
/**
 * Build a query string from a params object, skipping undefined/null values
 * so we never send empty filters the API would otherwise choke on.
 */
function buildQuery(params = {}) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') continue;
    search.set(key, String(value));
  }
  const qs = search.toString();
  return qs ? `?${qs}` : '';
}

/**
 * GET a path off the Council Gateway API and return parsed JSON.
 * Throws a descriptive Error on non-2xx responses so tool handlers
 * can surface something useful back to the model.
 */
export async function apiGet(path, params = {}) {
  // if (!API_TOKEN) {
  //   throw new Error(
  //     'COUNCIL_API_TOKEN is not set. Provide a bearer token for the Council Gateway API via the COUNCIL_API_TOKEN environment variable.'
  //   );
  // }
  // (not needed because the api currently does not require an api token, but leaving the code here in case that changes in the future)

  const url = `${BASE_URL}${path}${buildQuery(params)}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    let detail = '';
    try {
      detail = await response.text();
    } catch {
      // ignore body read failures
    }
    throw new Error(`Council API request failed: ${response.status} ${response.statusText} — ${url}\n${detail}`);
  }

  return response.json();
}

/**
 * GET a path that may resolve to a non-JSON payload (e.g. a redirect to a
 * PDF file). Returns metadata about the response instead of trying to parse
 * a binary body as JSON. If the response genuinely is JSON, that's returned
 * under `data`.
 */
export async function apiGetResource(path, params = {}) {
  // if (!API_TOKEN) {
  //   throw new Error(
  //     'COUNCIL_API_TOKEN is not set. Provide a bearer token for the Council Gateway API via the COUNCIL_API_TOKEN environment variable.'
  //   );
  // }
  //(not needed because the api currently does not require an api token, but leaving the code here in case that changes in the future)
  
  const url = `${BASE_URL}${path}${buildQuery(params)}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    let detail = '';
    try {
      detail = await response.text();
    } catch {
      // ignore body read failures
    }
    throw new Error(`Council API request failed: ${response.status} ${response.statusText} — ${url}\n${detail}`);
  }

  const contentType = response.headers.get('content-type') ?? '';
  const result = {
    resolved_url: response.url,
    status: response.status,
    content_type: contentType,
  };

  if (contentType.includes('application/json')) {
    result.data = await response.json();
  }

  return result;
}
