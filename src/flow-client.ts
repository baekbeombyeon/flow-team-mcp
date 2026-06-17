import type { FlowMethod } from "./endpoints.js";

export type FlowRequestOptions = {
  method: FlowMethod;
  path: string;
  pathParams?: Record<string, unknown>;
  query?: Record<string, unknown>;
  body?: unknown;
  apiKey?: string;
  baseUrl?: string;
};

export async function callFlow(options: FlowRequestOptions) {
  const apiKey = options.apiKey ?? process.env.FLOW_API_KEY;
  if (!apiKey) {
    throw new Error("FLOW_API_KEY 환경변수 또는 apiKey 입력값이 필요합니다.");
  }

  const baseUrl = options.baseUrl ?? process.env.FLOW_API_BASE_URL ?? "https://api.flow.team";
  const url = new URL(applyPathParams(options.path, options.pathParams), baseUrl);
  appendQuery(url, options.query);

  const headers: Record<string, string> = {
    Accept: "application/json",
    "x-flow-api-key": apiKey
  };

  const init: RequestInit = {
    method: options.method,
    headers
  };

  if (options.body !== undefined && options.method !== "GET") {
    headers["Content-Type"] = "application/json";
    init.body = JSON.stringify(options.body);
  }

  const response = await fetch(url, init);
  const responseBody = await parseResponse(response);

  return {
    request: {
      method: options.method,
      url: redactApiKey(url.toString())
    },
    response: {
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      body: responseBody
    }
  };
}

function applyPathParams(path: string, params: Record<string, unknown> = {}) {
  return path.replace(/\{([^}]+)\}|:([A-Za-z0-9_]+)/g, (_match, braceName, colonName) => {
    const name = braceName ?? colonName;
    const value = params[name];
    if (value === undefined || value === null) {
      throw new Error(`Missing path parameter: ${name}`);
    }
    return encodeURIComponent(String(value));
  });
}

function appendQuery(url: URL, query: Record<string, unknown> = {}) {
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null) continue;

    if (Array.isArray(value)) {
      for (const item of value) {
        if (item !== undefined && item !== null) {
          url.searchParams.append(key, String(item));
        }
      }
      continue;
    }

    url.searchParams.set(key, String(value));
  }
}

async function parseResponse(response: Response) {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

function redactApiKey(value: string) {
  return value.replace(/(x-flow-api-key=)[^&]+/gi, "$1[redacted]");
}
