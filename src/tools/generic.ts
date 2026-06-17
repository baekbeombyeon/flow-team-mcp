import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { endpoints, type FlowEndpoint, type FlowMethod } from "../endpoints.js";
import { callFlow } from "../flow-client.js";
import { jsonResult } from "../mcp-result.js";

const jsonRecord = z.record(z.string(), z.unknown());

export function registerGenericTools(server: McpServer) {
  server.registerTool(
    "list_flow_endpoints",
    {
      title: "List Flow OpenAPI endpoints",
      description: "Flow OpenAPI 문서에서 수집한 엔드포인트 목록을 조회합니다.",
      inputSchema: {
        version: z.enum(["v1", "v2"]).optional(),
        group: z.string().optional(),
        method: z.enum(["GET", "POST", "PATCH", "DELETE"]).optional(),
        search: z.string().optional()
      }
    },
    async ({ version, group, method, search }) => {
      const term = search?.trim().toLowerCase();
      const filtered = endpoints.filter((endpoint) => {
        if (version && endpoint.version !== version) return false;
        if (group && endpoint.group !== group) return false;
        if (method && endpoint.method !== method) return false;
        if (!term) return true;
        return [endpoint.id, endpoint.group, endpoint.path, endpoint.description]
          .join(" ")
          .toLowerCase()
          .includes(term);
      });

      return jsonResult(filtered);
    }
  );

  server.registerTool(
    "get_flow_endpoint",
    {
      title: "Get Flow endpoint metadata",
      description: "엔드포인트 ID로 Flow OpenAPI 경로, HTTP 메서드, 문서 URL을 조회합니다.",
      inputSchema: {
        id: z.string()
      }
    },
    async ({ id }) => {
      const endpoint = findEndpoint(id);
      return jsonResult(endpoint);
    }
  );

  server.registerTool(
    "flow_request",
    {
      title: "Call Flow OpenAPI",
      description:
        "Flow OpenAPI를 호출합니다. FLOW_API_KEY 환경변수를 기본으로 사용하며, x-flow-api-key 헤더를 자동 추가합니다.",
      inputSchema: {
        endpointId: z.string().optional().describe("list_flow_endpoints에서 확인한 endpoint id"),
        method: z.enum(["GET", "POST", "PATCH", "DELETE"]).optional(),
        path: z.string().optional().describe("예: /v1/projects/{projectId}/participants"),
        pathParams: jsonRecord.optional().describe("경로 템플릿 변수 값"),
        query: jsonRecord.optional().describe("쿼리스트링 값"),
        body: z.unknown().optional().describe("JSON 요청 본문"),
        apiKey: z.string().optional().describe("FLOW_API_KEY 대신 사용할 API Key"),
        baseUrl: z.string().url().optional().describe("기본값: FLOW_API_BASE_URL 또는 https://api.flow.team")
      }
    },
    async (input) => {
      const endpoint = input.endpointId ? findEndpoint(input.endpointId) : undefined;
      const method = (input.method ?? endpoint?.method) as FlowMethod | undefined;
      const path = input.path ?? endpoint?.path;

      if (!method) {
        throw new Error("method 또는 endpointId가 필요합니다.");
      }

      if (!path) {
        throw new Error("path 또는 endpointId가 필요합니다.");
      }

      const result = await callFlow({
        method,
        path,
        pathParams: input.pathParams,
        query: input.query,
        body: input.body,
        apiKey: input.apiKey,
        baseUrl: input.baseUrl
      });

      return jsonResult(result);
    }
  );
}

function findEndpoint(id: string): FlowEndpoint {
  const endpoint = endpoints.find((candidate) => candidate.id === id);
  if (!endpoint) {
    throw new Error(`Unknown endpoint id: ${id}`);
  }
  return endpoint;
}
