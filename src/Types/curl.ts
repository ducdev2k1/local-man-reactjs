import type { TypeHttpMethod } from './models';

/**
 * Interface for the result of parse-curl
 */
export interface ICurlParseResult {
  method: TypeHttpMethod;
  url: string;
  header: Record<string, string>;
  body: string;
}
