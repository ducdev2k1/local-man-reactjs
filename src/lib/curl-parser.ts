import parse from 'parse-curl';
import { v4 as uuidv4 } from 'uuid';
import type { ICurlParseResult } from '../Types/curl';
import type {
  IApiRequest,
  IKeyValuePair,
  TypeHttpMethod,
} from '../Types/models';

/**
 * Parses a cURL command string into an ICurlParseResult object.
 * @param command - The cURL command string.
 * @returns The parsed result or null if the command is invalid.
 */
export const parseCurl = (command: string): ICurlParseResult | null => {
  if (!command || !command.trim().startsWith('curl')) {
    return null;
  }

  try {
    const parsed = parse(command);
    if (!parsed || !parsed.url) {
      return null;
    }

    const header = parsed.header || {};

    // Some cURL parsers put cookies in Set-Cookie (incorrectly for requests)
    // or we might already have it in Cookie. We prefer 'Cookie'.
    if (header['Set-Cookie'] && !header['Cookie']) {
      header['Cookie'] = header['Set-Cookie'];
      delete header['Set-Cookie'];
    }

    return {
      method: (parsed.method || 'GET') as TypeHttpMethod,
      url: parsed.url,
      header: header,
      body: parsed.body || '',
    };
  } catch (error) {
    console.error('Failed to parse cURL:', error);
    return null;
  }
};

/**
 * Maps a parsed cURL result to an IApiRequest object for updating a request.
 * @param parsedResult - The result from parseCurl.
 * @returns Partial IApiRequest object.
 */
export const mapCurlToRequest = (
  parsedResult: ICurlParseResult,
): Partial<IApiRequest> => {
  const headers: IKeyValuePair[] = Object.entries(parsedResult.header).map(
    ([key, value]) => ({
      id: uuidv4(),
      key,
      value,
      description: '',
      enabled: true,
    }),
  );

  const requestUpdate: Partial<IApiRequest> = {
    method: parsedResult.method,
    url: parsedResult.url,
    headers,
  };

  if (parsedResult.body) {
    requestUpdate.body = {
      type: 'JSON', // Default to JSON, could be improved to detect content-type
      content: parsedResult.body,
    };

    // Simple content-type detection
    const contentType = Object.keys(parsedResult.header).find(
      (k) => k.toLowerCase() === 'content-type',
    );
    if (contentType) {
      const value = parsedResult.header[contentType].toLowerCase();
      if (value.includes('xml')) {
        requestUpdate.body.type = 'XML';
      } else if (value.includes('form-urlencoded')) {
        requestUpdate.body.type = 'x-www-form-urlencoded';
      } else if (value.includes('form-data')) {
        requestUpdate.body.type = 'Form Data';
      }
    }
  }

  return requestUpdate;
};
