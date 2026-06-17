import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { callFlow } from "../flow-client.js";
import { jsonResult } from "../mcp-result.js";
import {
  addProjectParticipantsInputSchema,
  apiKeyOptionsSchema,
  createProjectInputSchema,
  flowUserIdSchema,
  listProjectsQuerySchema,
  projectApiSchemas,
  projectIdSchema
} from "../schemas/projects.js";

export function registerProjectTools(server: McpServer) {
  server.registerTool(
    "get_project_api_schema",
    {
      title: "Get Flow project API schema",
      description: "프로젝트 API의 Metadata, Request, Response, Error 문서 정보를 조회합니다.",
      inputSchema: {
        operationId: z.string().optional(),
        toolName: z.string().optional()
      }
    },
    async ({ operationId, toolName }) => {
      const schemas = projectApiSchemas.filter((schema) => {
        if (operationId && schema.operationId !== operationId) return false;
        if (toolName && schema.toolName !== toolName) return false;
        return true;
      });

      if ((operationId || toolName) && schemas.length === 0) {
        throw new Error("일치하는 프로젝트 API 스키마가 없습니다.");
      }

      return jsonResult(schemas);
    }
  );

  server.registerTool(
    "list_projects",
    {
      title: "List Flow projects",
      description: "Flow 프로젝트 목록을 조회합니다.",
      inputSchema: {
        ...listProjectsQuerySchema,
        ...apiKeyOptionsSchema
      }
    },
    async ({ cursor, apiKey, baseUrl }) => {
      const result = await callFlow({
        method: "GET",
        path: "/v1/projects",
        query: { cursor },
        apiKey,
        baseUrl
      });

      return jsonResult(result);
    }
  );

  server.registerTool(
    "list_participant_projects",
    {
      title: "List projects by participant",
      description: "특정 사용자가 참여 중인 Flow 프로젝트를 조회합니다.",
      inputSchema: {
        participantId: flowUserIdSchema,
        ...apiKeyOptionsSchema
      }
    },
    async ({ participantId, apiKey, baseUrl }) => {
      const result = await callFlow({
        method: "GET",
        path: "/v1/projects/participants/{participantId}",
        pathParams: { participantId },
        apiKey,
        baseUrl
      });

      return jsonResult(result);
    }
  );

  server.registerTool(
    "get_project_participants",
    {
      title: "Get Flow project participants",
      description: "Flow 프로젝트 참여자 목록을 조회합니다.",
      inputSchema: {
        projectId: projectIdSchema,
        ...apiKeyOptionsSchema
      }
    },
    async ({ projectId, apiKey, baseUrl }) => {
      const result = await callFlow({
        method: "GET",
        path: "/v1/projects/{projectId}/participants",
        pathParams: { projectId },
        apiKey,
        baseUrl
      });

      return jsonResult(result);
    }
  );

  server.registerTool(
    "get_project_columns",
    {
      title: "Get Flow project columns",
      description: "Flow 프로젝트 컬럼 목록을 조회합니다.",
      inputSchema: {
        projectId: projectIdSchema,
        userId: flowUserIdSchema.describe("프로젝트 컬럼 조회 기준 사용자 ID"),
        ...apiKeyOptionsSchema
      }
    },
    async ({ projectId, userId, apiKey, baseUrl }) => {
      const result = await callFlow({
        method: "GET",
        path: "/v1/projects/{projectId}/columns",
        pathParams: { projectId },
        query: { userId },
        apiKey,
        baseUrl
      });

      return jsonResult(result);
    }
  );

  server.registerTool(
    "get_project_status_columns",
    {
      title: "Get Flow project status columns",
      description: "Flow 프로젝트 상태 컬럼 목록을 조회합니다.",
      inputSchema: {
        projectId: projectIdSchema,
        userId: flowUserIdSchema.describe("상태 컬럼 조회 기준 사용자 ID"),
        ...apiKeyOptionsSchema
      }
    },
    async ({ projectId, userId, apiKey, baseUrl }) => {
      const result = await callFlow({
        method: "GET",
        path: "/v1/projects/{projectId}/columns/status",
        pathParams: { projectId },
        query: { userId },
        apiKey,
        baseUrl
      });

      return jsonResult(result);
    }
  );

  server.registerTool(
    "create_project",
    {
      title: "Create Flow project",
      description: "Flow 프로젝트를 생성합니다.",
      inputSchema: createProjectInputSchema
    },
    async ({ apiKey, baseUrl, ...body }) => {
      const result = await callFlow({
        method: "POST",
        path: "/v1/projects",
        body,
        apiKey,
        baseUrl
      });

      return jsonResult(result);
    }
  );

  server.registerTool(
    "add_project_participants",
    {
      title: "Add Flow project participants",
      description: "Flow 프로젝트에 참여자를 추가합니다.",
      inputSchema: addProjectParticipantsInputSchema
    },
    async ({ projectId, registerId, participants, apiKey, baseUrl }) => {
      const result = await callFlow({
        method: "POST",
        path: "/v1/projects/{projectId}/participants",
        pathParams: { projectId },
        body: { registerId, participants },
        apiKey,
        baseUrl
      });

      return jsonResult(result);
    }
  );
}
