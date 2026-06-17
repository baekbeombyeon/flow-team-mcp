# flow-team-mcp

Flow Team OpenAPI용 MCP 서버입니다.

문서: <https://api.flow.team/docs>

## Tools

- `list_flow_endpoints`: 문서에서 수집한 Flow OpenAPI 엔드포인트 목록 조회
- `get_flow_endpoint`: 엔드포인트 ID로 메타데이터 조회
- `flow_request`: `x-flow-api-key` 헤더를 붙여 Flow OpenAPI 호출

프로젝트 전용 도구:

- `get_project_api_schema`: 프로젝트 API의 Metadata, Request, Response, Error 문서 조회
- `list_projects`
- `list_participant_projects`
- `get_project_participants`
- `get_project_columns`
- `get_project_status_columns`
- `create_project`
- `add_project_participants`

## Structure

```text
src/
  index.ts              # MCP 서버 부트스트랩
  endpoints.ts          # Flow API endpoint catalog
  flow-client.ts        # x-flow-api-key, path/query/body 처리, fetch 공통화
  mcp-result.ts         # MCP 응답 포맷 유틸
  schemas/
    projects.ts         # 프로젝트 API 문서 메타데이터와 Zod input schema
  tools/
    generic.ts          # list_flow_endpoints, get_flow_endpoint, flow_request
    projects.ts         # 프로젝트 전용 MCP tools
```

## Setup

```bash
npm install
npm run build
```

MCP 클라이언트 설정 예시:

```json
{
  "mcpServers": {
    "flow-team": {
      "command": "node",
      "args": ["/Users/baekbeombyeon/Projects/flow-team-mcp/dist/index.js"],
      "env": {
        "FLOW_API_KEY": "YOUR_FLOW_API_KEY"
      }
    }
  }
}
```

선택 환경변수:

- `FLOW_API_KEY`: Flow Developer Portal에서 발급한 API Key
- `FLOW_API_BASE_URL`: 기본값 `https://api.flow.team`

## Example

```json
{
  "projectId": "123000"
}
```

프로젝트 생성:

```json
{
  "registerId": "company@company.name",
  "title": "테스트 프로젝트",
  "description": "이 프로젝트는 OpenAPI로 생성되었습니다.",
  "defaultTab": "feed"
}
```

직접 경로를 호출해야 하는 API는 `flow_request`를 사용할 수 있습니다.
