import { fetch } from '@tauri-apps/plugin-http';
import type { IApiRequest, IApiResponse } from '../Types/models';

/**
 * Sends an API request using the Tauri HTTP plugin.
 * This bypasses browser restrictions on headers like Cookie, User-Agent, etc.
 * @param request - The active request to send.
 * @returns Promise<IApiResponse>
 */
export const sendRequest = async (
  request: IApiRequest,
): Promise<IApiResponse> => {
  const startTime = performance.now();

  const headers: Record<string, string> = {
    Accept: '*/*',
    'User-Agent': 'LocalManRuntime/1.0.0',
    Connection: 'keep-alive',
  };

  request.headers.forEach((h) => {
    if (h.enabled && h.key) {
      headers[h.key] = h.value;
    }
  });

  // Handle Auth
  if (request.auth.type === 'Bearer' && request.auth.token) {
    headers['Authorization'] = `Bearer ${request.auth.token}`;
  } else if (request.auth.type === 'Basic Auth' && request.auth.username) {
    const credentials = btoa(
      `${request.auth.username}:${request.auth.password || ''}`,
    );
    headers['Authorization'] = `Basic ${credentials}`;
  } else if (request.auth.type === 'API Key' && request.auth.apiKey) {
    if (request.auth.apiKeyLocation === 'header') {
      headers[request.auth.apiKey] = request.auth.apiValue || '';
    }
    // Query location handled via URL params if needed, but for now we focus on headers
  }

  // Handle URL Params
  let finalUrl = request.url;
  if (request.params.length > 0) {
    try {
      const urlObj = new URL(
        request.url.startsWith('http') ? request.url : `http://${request.url}`,
      );
      request.params.forEach((p) => {
        if (p.enabled && p.key) {
          urlObj.searchParams.append(p.key, p.value);
        }
      });
      finalUrl = urlObj.toString();
    } catch (e) {
      console.error('Invalid URL for params:', e);
    }
  }

  const options: RequestInit = {
    method: request.method,
    headers,
  };

  if (
    request.method !== 'GET' &&
    request.method !== 'HEAD' &&
    request.body.content
  ) {
    options.body = request.body.content;
  }

  try {
    // Using Tauri's fetch which bypasses CORS and restricted headers
    const response = await fetch(finalUrl, options);
    const endTime = performance.now();
    const body = await response.text();

    // Extract headers as an object
    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    return {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
      body,
      time: Math.round(endTime - startTime),
      size: new Blob([body]).size,
    };
  } catch (error: Error | unknown) {
    const endTime = performance.now();
    return {
      status: 0,
      statusText: error instanceof Error ? error.message : 'Unknown Error',
      headers: {},
      body: JSON.stringify(
        { error: error instanceof Error ? error.message : 'Failed to fetch' },
        null,
        2,
      ),
      time: Math.round(endTime - startTime),
      size: 0,
    };
  }
};
