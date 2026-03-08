declare module 'parse-curl' {
  interface ParsedCurl {
    method?: string;
    url: string;
    header?: Record<string, string>;
    body?: string;
  }
  function parse(command: string): ParsedCurl;
  export default parse;
}
