export type FlowMethod = "GET" | "POST" | "PATCH" | "DELETE";

export type FlowEndpoint = {
  id: string;
  version: "v1" | "v2";
  group: string;
  method: FlowMethod;
  path: string;
  description: string;
  docsUrl: string;
};

const docsBase = "https://api.flow.team/docs/api";

export const endpoints = [
  endpoint("v1", "bots", "GET", "/v1/bots", "알림봇 조회"),
  endpoint("v1", "bots", "POST", "/v1/bots/{botId}/notifications", "알림봇 메시지 전송"),
  endpoint("v1", "bots", "POST", "/v1/bots/{botId}/notifications/bulk", "다수의 대상에게 알림봇 메시지 전송"),
  endpoint("v1", "bots", "POST", "/v1/bots/{botId}/posts", "게시글 작성"),
  endpoint("v1", "bots", "POST", "/v1/bots/{botId}/tasks", "업무 작성"),
  endpoint("v1", "bots", "POST", "/v1/bots/{botId}/schedules", "일정 작성"),

  endpoint("v1", "calendars", "GET", "/v1/calendars", "사용자 캘린더 목록 조회"),
  endpoint("v1", "calendars", "GET", "/v1/calendars/default", "기본 캘린더 ID 조회"),
  endpoint("v1", "calendars", "GET", "/v1/calendars/subscribables", "구독 가능 캘린더 검색"),
  endpoint("v1", "calendars", "GET", "/v1/calendars/events", "일정 범위 조회"),
  endpoint("v1", "calendars", "GET", "/v1/calendars/events/{eventSrno}", "일정 상세 조회"),
  endpoint("v1", "calendars", "POST", "/v1/calendars/events", "일정 생성"),
  endpoint("v1", "calendars", "PATCH", "/v1/calendars/events/{eventSrno}", "일정 수정"),
  endpoint("v1", "calendars", "DELETE", "/v1/calendars/events/{eventSrno}", "일정 삭제"),

  endpoint("v1", "chats", "GET", "/v1/chats/participants/{participantId}", "참여중인 채팅방 조회"),
  endpoint("v1", "chats", "GET", "/v1/chats/{roomId}", "채팅방 상세정보 조회"),
  endpoint("v1", "chats", "POST", "/v1/chats/{roomId}/messages", "채팅방에 메시지 전송"),
  endpoint("v1", "chats", "POST", "/v1/chats/{roomId}/participants", "채팅방에 참여자 초대"),

  endpoint("v1", "divisions", "GET", "/v1/divisions", "부서 조회"),
  endpoint("v1", "divisions", "POST", "/v1/divisions", "부서 추가"),
  endpoint("v1", "divisions", "POST", "/v1/divisions/bulk", "복수의 부서 추가"),
  endpoint("v1", "divisions", "PATCH", "/v1/divisions/{divisionCode}", "부서 정보 수정"),
  endpoint("v1", "divisions", "PATCH", "/v1/divisions/bulk", "복수의 부서 정보 수정"),

  endpoint("v1", "employees", "GET", "/v1/employees", "복수의 사용자(구성원) 조회"),
  endpoint("v1", "employees", "GET", "/v1/employees/{userId}", "사용자(구성원) 조회"),
  endpoint("v1", "employees", "POST", "/v1/employees", "사용자(구성원) 추가"),
  endpoint("v1", "employees", "POST", "/v1/employees/bulk", "복수의 사용자(구성원) 추가"),
  endpoint("v1", "employees", "PATCH", "/v1/employees/{userId}", "사용자(구성원) 정보 수정"),
  endpoint("v1", "employees", "PATCH", "/v1/employees/bulk", "복수의 사용자(구성원) 정보 수정"),

  endpoint("v1", "posts", "GET", "/v1/posts/projects/{projectId}", "프로젝트 내 게시글 조회"),
  endpoint("v1", "posts", "POST", "/v1/posts/projects/{projectId}", "게시글 작성"),
  endpoint("v1", "posts", "POST", "/v1/posts/projects/{projectId}/tasks", "업무 작성"),
  endpoint("v1", "posts", "PATCH", "/v1/posts/projects/{projectId}/tasks/{taskId}/status", "업무 상태 수정"),
  endpoint("v1", "posts", "PATCH", "/v1/posts/projects/{projectId}/tasks/{taskId}/start-date", "업무 시작일 수정"),
  endpoint("v1", "posts", "PATCH", "/v1/posts/projects/{projectId}/tasks/{taskId}/end-date", "업무 마감일 수정"),
  endpoint("v1", "posts", "PATCH", "/v1/posts/projects/{projectId}/tasks/{taskId}/priority", "업무 우선순위 수정"),
  endpoint("v1", "posts", "PATCH", "/v1/posts/projects/{projectId}/tasks/{taskId}/worker", "업무 담당자 수정"),
  endpoint("v1", "posts", "POST", "/v1/posts/projects/{projectId}/schedules", "일정 작성"),
  endpoint("v1", "posts", "POST", "/v1/posts/projects/{projectId}/todos", "할일 작성"),

  endpoint("v1", "projects", "GET", "/v1/projects", "프로젝트 조회"),
  endpoint("v1", "projects", "GET", "/v1/projects/participants/{participantId}", "참여중인 프로젝트 조회"),
  endpoint("v1", "projects", "GET", "/v1/projects/{projectId}/participants", "프로젝트 참여자 조회"),
  endpoint("v1", "projects", "GET", "/v1/projects/{projectId}/columns", "프로젝트 컬럼 조회"),
  endpoint("v1", "projects", "GET", "/v1/projects/{projectId}/columns/status", "프로젝트 상태 컬럼 조회"),
  endpoint("v1", "projects", "POST", "/v1/projects", "프로젝트 생성"),
  endpoint("v1", "projects", "POST", "/v1/projects/{projectId}/participants", "프로젝트 참여자 생성"),

  endpoint("v1", "search", "GET", "/v1/search/posts", "글 검색"),
  endpoint("v1", "search", "GET", "/v1/search/projects", "프로젝트 검색"),

  endpoint("v1", "sso", "GET", "/v1/sso", "RSA Public Key 생성"),
  endpoint("v1", "sso", "GET", "/v1/sso/projects/participants/{participantId}", "참여중인 프로젝트 조회"),
  endpoint("v1", "sso", "GET", "/v1/sso/projects/{projectId}/participants/{participantId}", "참여중인 단일 프로젝트 조회"),

  endpoint("v2", "employees", "GET", "/v2/employees", "사용자(구성원) 조회"),
  endpoint("v2", "employees", "GET", "/v2/employees/:userId", "단일 사용자(구성원) 조회")
] satisfies FlowEndpoint[];

function endpoint(
  version: FlowEndpoint["version"],
  group: string,
  method: FlowMethod,
  path: string,
  description: string
): FlowEndpoint {
  const idPath = path
    .replace(/^\/+/, "")
    .replace(/[{}:]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/_+$/g, "");

  return {
    id: `${method.toLowerCase()}_${idPath}`,
    version,
    group,
    method,
    path,
    description,
    docsUrl: `${docsBase}/${version}/${group}`
  };
}
