import { fetch } from "@tauri-apps/plugin-http";
import type { IApiRequest, IApiResponse, IEnvironment } from "../Types/models";

/**
 * Sends an API request using the Tauri HTTP plugin.
 * This bypasses browser restrictions on headers like Cookie, User-Agent, etc.
 * @param request - The active request to send.
 * @returns Promise<IApiResponse>
 */
export const sendRequest = async (
  request: IApiRequest,
  environment?: IEnvironment
): Promise<IApiResponse> => {
  const startTime = performance.now();

  // Create a deep copy to avoid mutating store state
  const req = JSON.parse(JSON.stringify(request)) as IApiRequest;

  const substitute = (text: string) => {
    if (!text || !environment || !environment.variables.length) return text;
    let newText = text;
    environment.variables.filter(v => v.enabled).forEach(v => {
      newText = newText.split(`{{${v.key}}}`).join(v.value);
    });
    return newText;
  };

  req.url = substitute(req.url);

  const headers: Record<string, string> = {
    Accept: "*/*",
    "User-Agent": "LocalManRuntime/1.0.0",
    Connection: "keep-alive",
  };

  req.headers.forEach((h) => {
    if (h.enabled && h.key) {
      headers[substitute(h.key)] = substitute(h.value);
    }
  });

  // Handle URL Params & API Key Query Auth
  let finalUrl = req.url;
  try {
    const urlObj = new URL(
      req.url.startsWith("http") ? req.url : `http://${req.url}`,
    );

    // Add standard params
    if (req.params && req.params.length > 0) {
      req.params.forEach((p) => {
        if (p.enabled && p.key) {
          urlObj.searchParams.append(substitute(p.key), substitute(p.value));
        }
      });
    }

    // Handle Auth (Query Map)
    if (
      req.auth.type === "API Key" &&
      req.auth.apiKey &&
      req.auth.apiKeyLocation === "query"
    ) {
      urlObj.searchParams.append(substitute(req.auth.apiKey), substitute(req.auth.apiValue || ""));
    }

    finalUrl = urlObj.toString();
  } catch (e) {
    console.error("Invalid URL for params:", e);
  }

  // Handle Auth (Headers)
  if (req.auth.type === "Bearer" && req.auth.token) {
    headers["Authorization"] = `Bearer ${substitute(req.auth.token)}`;
  } else if (req.auth.type === "Basic Auth" && req.auth.username) {
    const credentials = btoa(
      `${substitute(req.auth.username)}:${substitute(req.auth.password || "")}`,
    );
    headers["Authorization"] = `Basic ${credentials}`;
  } else if (
    req.auth.type === "API Key" &&
    req.auth.apiKey &&
    req.auth.apiKeyLocation === "header"
  ) {
    headers[substitute(req.auth.apiKey)] = substitute(req.auth.apiValue || "");
  }

  // Determine Body Options
  const options: RequestInit = {
    method: req.method,
  };

  if (req.method !== "GET" && req.method !== "HEAD") {
    switch (req.body.type) {
      case "JSON":
        headers["Content-Type"] = "application/json";
        options.body = substitute(req.body.content);
        break;
      case "XML":
        headers["Content-Type"] = "application/xml";
        options.body = substitute(req.body.content);
        break;
      case "Raw":
        options.body = substitute(req.body.content);
        // User may have set their own Content-Type header manually
        break;
      case "Form Data": {
        const formData = new FormData();
        req.body.formData?.forEach((item) => {
          if (item.enabled && item.key) {
            formData.append(substitute(item.key), substitute(item.value));
          }
        });
        options.body = formData as unknown as BodyInit; // Tauri fetch handles FormData natively
        // Do not set Content-Type header; fetch will automatically generate multipart/form-data with boundary
        break;
      }
      case "x-www-form-urlencoded": {
        headers["Content-Type"] = "application/x-www-form-urlencoded";
        const urlEncodedParams = new URLSearchParams();
        req.body.urlencoded?.forEach((item) => {
          if (item.enabled && item.key) {
            urlEncodedParams.append(substitute(item.key), substitute(item.value));
          }
        });
        options.body = urlEncodedParams.toString();
        break;
      }
      case "none":
      default:
        break;
    }
  }

  options.headers = headers;

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
      statusText: error instanceof Error ? error.message : "Unknown Error",
      headers: {},
      body: JSON.stringify(
        { error: error instanceof Error ? error.message : "Failed to fetch" },
        null,
        2,
      ),
      time: Math.round(endTime - startTime),
      size: 0,
    };
  }
};
