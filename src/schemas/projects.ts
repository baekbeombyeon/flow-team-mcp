import { z } from "zod";

export const apiKeyOptionsSchema = {
  apiKey: z.string().optional(),
  baseUrl: z.string().url().optional()
};

export const flowUserIdSchema = z
  .string()
  .min(1)
  .max(100)
  .regex(/^[A-Za-z0-9._@-]+$/, "알파벳, 숫자, 특수문자(-, _, @, .)만 사용할 수 있습니다.");

export const projectIdSchema = z
  .string()
  .min(1)
  .max(15)
  .regex(/^[0-9]+$/, "숫자만 사용할 수 있습니다.");

export const listProjectsQuerySchema = {
  cursor: z.string().regex(/^[0-9]+$/).optional().describe("페이징 커서. 기본값 0, page size 500")
};

export const createProjectInputSchema = {
  registerId: flowUserIdSchema.describe("작성자ID"),
  title: z.string().min(1).max(50).describe("프로젝트 제목"),
  description: z.string().min(1).max(10_000).optional().describe("프로젝트 설명"),
  defaultTab: z.enum(["feed", "task", "gantt", "calendar", "file"]).optional().describe("홈 탭 설정"),
  postPermission: z
    .object({
      view: z.enum(["all", "registerAndAdmin"]).optional().describe("게시글 조회권한"),
      write: z.enum(["all", "admin"]).optional().describe("게시글 작성권한"),
      edit: z.enum(["all", "register", "registerAndAdmin"]).optional().describe("게시글 수정권한")
    })
    .optional()
    .describe("게시글 권한 정보"),
  commentPermission: z
    .object({
      write: z.enum(["all", "admin"]).optional().describe("댓글 작성권한")
    })
    .optional()
    .describe("댓글 권한 정보"),
  ...apiKeyOptionsSchema
};

export const addProjectParticipantsInputSchema = {
  projectId: projectIdSchema.describe("프로젝트ID"),
  registerId: flowUserIdSchema.describe("작성자ID"),
  participants: z
    .array(
      z.object({
        participantId: flowUserIdSchema.describe("참여자ID")
      })
    )
    .min(1)
    .describe("참여자 정보"),
  ...apiKeyOptionsSchema
};

export const commonErrorCodes = [
  { statusCode: 400, code: "VALIDATION_ERROR", description: "클라이언트에서 보낸 요청의 잘못된 형식 오류" },
  { statusCode: 401, code: "UNAUTHORIZED_ERROR", description: "필요한 인증 정보가 누락된 경우" },
  { statusCode: 403, code: "FORBIDDEN_ERROR", description: "해당 리소스에 접근 권한이 없는 경우" },
  { statusCode: 404, code: "NOT_FOUND_ERROR", description: "요청하는 리소스를 찾을 수 없는 경우" },
  { statusCode: 409, code: "ALREADY_EXIST_ERROR", description: "클라이언트가 요청하는 리소스가 이미 존재하는 경우" },
  { statusCode: 412, code: "PRECONDITION_FAILED_ERROR", description: "선행조건을 만족하지 않아 요청을 처리할 수 없는 경우" },
  { statusCode: 412, code: "NOT_EXIST_ERROR", description: "요청하는 리소스를 찾을 수 없어 수정, 삭제가 불가능한 경우" },
  { statusCode: 412, code: "REACHED_MAX_ERROR", description: "생성 가능한 리소스의 한계에 도달하여 더이상 생성이 불가능한 경우" },
  { statusCode: 429, code: "RATE_LIMIT_EXCEEDED_ERROR", description: "요청 횟수가 사용량을 초과한 경우" },
  { statusCode: 500, code: "INTERNAL_SERVER_ERROR", description: "특정할 수 없는 서버의 내부 오류" },
  { statusCode: 500, code: "SQL_EXECUTION_ERROR", description: "데이터베이스 쿼리 실행 실패" }
];

export const projectApiSchemas = [
  {
    operationId: "getProjects",
    toolName: "list_projects",
    method: "GET",
    path: "/v1/projects",
    summary: "프로젝트 조회",
    metadata: {
      docsUrl: "https://api.flow.team/docs/api/v1/projects",
      description: "이용기관에서 생성된 프로젝트 정보를 조회합니다. cursor 기반으로 한 번에 최대 500개까지 조회합니다."
    },
    request: {
      headers: authHeaders(),
      paths: [],
      queries: [
        {
          name: "cursor",
          type: "string",
          required: false,
          example: "0",
          description: "페이징 커서 (page size: 500)",
          constraints: [{ name: "accept", value: "숫자" }, { name: "default", value: "0" }]
        }
      ],
      body: []
    },
    response: {
      successExample: {
        success: true,
        message: "success",
        data: {
          hasNext: true,
          lastCursor: 4,
          projects: [
            {
              projectId: "123000",
              title: "[문의] 고객문의 프로젝트",
              projectUrl: "https://flow.team/main.act?projectId=123000"
            }
          ]
        }
      },
      fields: [
        "success:boolean",
        "code:number",
        "message:string",
        "data.hasNext:boolean",
        "data.lastCursor:number",
        "data.projects[].projectId:string",
        "data.projects[].title:string",
        "data.projects[].projectUrl:string"
      ]
    },
    errors: [...commonErrorCodes]
  },
  {
    operationId: "getProjectsByParticipant",
    toolName: "list_participant_projects",
    method: "GET",
    path: "/v1/projects/participants/{participantId}",
    summary: "참여중인 프로젝트 조회",
    metadata: {
      docsUrl: "https://api.flow.team/docs/api/v1/projects",
      description: "특정 사용자가 참여 중인 프로젝트 정보를 조회합니다."
    },
    request: {
      headers: authHeaders(),
      paths: [participantIdField()],
      queries: [],
      body: []
    },
    response: {
      fields: ["success:boolean", "code:number", "message:string", "data.projects[].projectId:string", "data.projects[].title:string", "data.projects[].projectUrl:string"]
    },
    errors: [
      ...commonErrorCodes,
      { code: "NOT_EXISTS_ERROR", message: "{participantId} 은(는) 존재하지 않는 사용자입니다.", description: "해당 사용자는 가입되어 있지 않습니다." },
      { code: "PRECONDITION_FAILED_ERROR", message: "{participantId} 은(는) 동일 이용기관의 사용자가 아닙니다.", description: "해당 사용자는 이용기관에 등록되어있지 않습니다." }
    ]
  },
  {
    operationId: "getProjectParticipants",
    toolName: "get_project_participants",
    method: "GET",
    path: "/v1/projects/{projectId}/participants",
    summary: "프로젝트 참여자 조회",
    metadata: {
      docsUrl: "https://api.flow.team/docs/api/v1/projects",
      description: "프로젝트 참여자 정보를 조회합니다."
    },
    request: {
      headers: authHeaders(),
      paths: [projectIdField()],
      queries: [],
      body: []
    },
    response: {
      fields: ["success:boolean", "code:number", "message:string", "data.participants[].inttId:string", "data.participants[].userId:string", "data.participants[].name:string"]
    },
    errors: [...commonErrorCodes, { code: "NOT_EXISTS_ERROR", message: "프로젝트가 존재하지 않습니다.", description: "해당 프로젝트가 존재하지 않습니다." }]
  },
  {
    operationId: "getProjectColumns",
    toolName: "get_project_columns",
    method: "GET",
    path: "/v1/projects/{projectId}/columns",
    summary: "프로젝트 컬럼 조회",
    metadata: {
      docsUrl: "https://api.flow.team/docs/api/v1/projects",
      description: "프로젝트 컬럼 목록을 조회합니다. userId 쿼리가 필수입니다."
    },
    request: {
      headers: authHeaders(),
      paths: [projectIdField("프로젝트 ID")],
      queries: [userIdQuery("프로젝트 컬럼 조회 기준 사용자 ID")],
      body: []
    },
    response: {
      fields: [
        "success:boolean",
        "code:number",
        "message:string",
        "data.projectId:string",
        "data.columns[].columnSrno:string",
        "data.columns[].columnName:string",
        "data.columns[].columnType:string",
        "data.columns[].defaultColumnYn:string",
        "data.columns[].multiOptionYn:string",
        "data.columns[].viewYn:string"
      ]
    },
    errors: projectAccessErrors()
  },
  {
    operationId: "getProjectStatusColumn",
    toolName: "get_project_status_columns",
    method: "GET",
    path: "/v1/projects/{projectId}/columns/status",
    summary: "프로젝트 상태 컬럼 조회",
    metadata: {
      docsUrl: "https://api.flow.team/docs/api/v1/projects",
      description: "상태 컬럼 옵션 목록을 조회합니다. userId 쿼리가 필수입니다."
    },
    request: {
      headers: authHeaders(),
      paths: [projectIdField("프로젝트 ID")],
      queries: [userIdQuery("상태 컬럼 조회 기준 사용자 ID")],
      body: []
    },
    response: {
      fields: [
        "success:boolean",
        "code:number",
        "message:string",
        "data.projectId:string",
        "data.columnSrno:string",
        "data.options[].optionSrno:string",
        "data.options[].optionName:string",
        "data.options[].optionColor:string"
      ]
    },
    errors: projectAccessErrors()
  },
  {
    operationId: "createProject",
    toolName: "create_project",
    method: "POST",
    path: "/v1/projects",
    summary: "프로젝트 생성",
    metadata: {
      docsUrl: "https://api.flow.team/docs/api/v1/projects",
      description: "새 프로젝트를 생성합니다."
    },
    request: {
      headers: authHeaders(),
      paths: [],
      queries: [],
      body: [
        { name: "registerId", type: "string", required: true, example: "company@company.name", description: "작성자ID", constraints: userIdConstraints() },
        { name: "title", type: "string", required: true, example: "테스트 프로젝트", description: "프로젝트 제목", constraints: [{ name: "min-length", value: 1 }, { name: "max-length", value: 50 }] },
        { name: "description", type: "string", required: false, example: "이 프로젝트는 OpenAPI로 생성되었습니다.", description: "프로젝트 설명", constraints: [{ name: "min-length", value: 1 }, { name: "max-length", value: 10_000 }] },
        { name: "defaultTab", type: "string", required: false, example: "feed", description: "홈 탭 설정", constraints: [{ name: "format", value: "feed | task | gantt | calendar | file" }] },
        { name: "postPermission.view", type: "string", required: false, example: "all", description: "게시글 조회권한", constraints: [{ name: "format", value: "all | registerAndAdmin" }] },
        { name: "postPermission.write", type: "string", required: false, example: "all", description: "게시글 작성권한", constraints: [{ name: "format", value: "all | admin" }] },
        { name: "postPermission.edit", type: "string", required: false, example: "registerAndAdmin", description: "게시글 수정권한", constraints: [{ name: "format", value: "all | register | registerAndAdmin" }] },
        { name: "commentPermission.write", type: "string", required: false, example: "all", description: "댓글 작성권한", constraints: [{ name: "format", value: "all | admin" }] }
      ]
    },
    response: {
      fields: ["success:boolean", "code:number", "message:string", "data.projectId:string"]
    },
    errors: [
      ...commonErrorCodes,
      { code: "NOT_EXISTS_ERROR", message: "{registerId} 은(는) 존재하지 않는 사용자입니다.", description: "해당 사용자는 가입되어 있지 않습니다." },
      { code: "PRECONDITION_FAILED_ERROR", message: "{registerId} 은(는) 동일 이용기관의 사용자가 아닙니다.", description: "해당 사용자는 이용기관에 등록되어있지 않습니다." }
    ]
  },
  {
    operationId: "createProjectParticipants",
    toolName: "add_project_participants",
    method: "POST",
    path: "/v1/projects/{projectId}/participants",
    summary: "프로젝트 참여자 생성",
    metadata: {
      docsUrl: "https://api.flow.team/docs/api/v1/projects",
      description: "프로젝트에 참여자를 추가합니다."
    },
    request: {
      headers: authHeaders(),
      paths: [projectIdField()],
      queries: [],
      body: [
        { name: "registerId", type: "string", required: true, example: "company@company.name", description: "작성자ID", constraints: userIdConstraints() },
        { name: "participants", type: "array", required: true, description: "참여자 정보", constraints: [{ name: "min-size", value: 1 }] },
        { name: "participants[].participantId", type: "string", required: true, example: "user@company.name", description: "참여자ID", constraints: userIdConstraints() }
      ]
    },
    response: {
      fields: ["success:boolean", "code:number", "message:string", "data.projectId:string"]
    },
    errors: [
      ...commonErrorCodes,
      { code: "NOT_EXISTS_ERROR", message: "프로젝트가 존재하지 않습니다.", description: "해당 프로젝트가 존재하지 않습니다." },
      { code: "NOT_EXISTS_ERROR", message: "{registerId} 은(는) 존재하지 않는 사용자입니다.", description: "해당 사용자는 가입되어 있지 않습니다." },
      { code: "PRECONDITION_FAILED_ERROR", message: "{registerId} 은(는) 동일 이용기관의 사용자가 아닙니다.", description: "해당 사용자는 이용기관에 등록되어있지 않습니다." },
      { code: "PRECONDITION_FAILED_ERROR", message: "{registerId} 은(는) 프로젝트의 관리자가 아닙니다.", description: "해당 사용자는 프로젝트의 관리자가 아닙니다." },
      { code: "ALREADY_EXIST_ERROR", message: "프로젝트에 이미 참여중인 사용자를 참여자로 추가할 수 없습니다.", description: "프로젝트에 중복으로 참여할 수 없습니다." }
    ]
  }
];

function authHeaders() {
  return [
    { name: "Content-Type", type: "string", required: true, example: "application/json", description: "요청 데이터 형식" },
    { name: "x-flow-api-key", type: "string", required: true, example: "dd9dcb4c-1f79-4eb8-9522-940fdefe6c1e", description: "키관리 페이지에서 발급받은 API Key" }
  ];
}

function userIdConstraints() {
  return [
    { name: "accept", value: "알파벳, 숫자, 특수문자(-, _, @, .)" },
    { name: "min-length", value: 1 },
    { name: "max-length", value: 100 }
  ];
}

function projectIdField(description = "프로젝트ID") {
  return {
    name: "projectId",
    type: "string",
    required: true,
    example: "940907",
    description,
    constraints: [{ name: "accept", value: "숫자" }, { name: "min-length", value: 1 }, { name: "max-length", value: 15 }]
  };
}

function participantIdField() {
  return {
    name: "participantId",
    type: "string",
    required: true,
    example: "flow@flow.team",
    description: "참여자ID",
    constraints: userIdConstraints()
  };
}

function userIdQuery(description: string) {
  return {
    name: "userId",
    type: "string",
    required: true,
    example: "cosmostest@yopmail.com",
    description,
    constraints: userIdConstraints()
  };
}

function projectAccessErrors() {
  return [
    ...commonErrorCodes,
    { code: "NOT_EXISTS_ERROR", message: "프로젝트가 존재하지 않습니다.", description: "해당 프로젝트가 존재하지 않습니다." },
    { code: "PRECONDITION_FAILED_ERROR", message: "사용자가 동일 이용기관에 속해있지 않습니다.", description: "조회 기준 사용자와 API Key의 이용기관이 다릅니다." }
  ];
}
