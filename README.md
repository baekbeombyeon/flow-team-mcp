# flow-team-mcp

Flow Team OpenAPI를 MCP(Model Context Protocol) 클라이언트에서 사용할 수 있게 해주는 로컬 MCP 서버입니다.

Flow API 문서: <https://api.flow.team/docs>

현재 릴리스: [v0.1.0](CHANGELOG.md)

## 주요 기능

- Flow OpenAPI 엔드포인트 목록을 검색하고 메타데이터를 확인할 수 있습니다.
- `FLOW_API_KEY`를 사용해 Flow OpenAPI를 직접 호출할 수 있습니다.
- 프로젝트 API는 전용 MCP 도구로 더 쉽게 사용할 수 있습니다.
  - 프로젝트 목록 조회
  - 특정 사용자가 참여 중인 프로젝트 조회
  - 프로젝트 참여자 조회
  - 프로젝트 컬럼 / 상태 컬럼 조회
  - 프로젝트 생성
  - 프로젝트 참여자 추가

## 준비 사항

- Node.js 20 이상 권장
- npm
- Flow Developer Portal에서 발급한 API Key

Git, Node.js, npm이 아직 설치되어 있지 않다면 [Windows/macOS 설치 가이드](docs/installation.md)를 먼저 확인하세요.

API Key는 서버 실행 환경변수로만 주입하세요. `.env`, 설정 파일, README 예시 등에 실제 키를 커밋하지 마세요.

## 로컬 설정

```bash
git clone <repository-url>
cd flow-team-mcp
npm install
npm run build
```

빌드가 끝나면 MCP 서버 엔트리포인트는 `dist/index.js`입니다.

로컬에서 서버 프로세스만 확인하려면 다음 명령을 실행할 수 있습니다.

```bash
FLOW_API_KEY="YOUR_FLOW_API_KEY" npm start
```

이 서버는 stdio 기반 MCP 서버라서 터미널에서 직접 실행하면 대기 상태로 보이는 것이 정상입니다. 실제 사용은 MCP 클라이언트 설정을 통해 연결합니다.

## MCP 클라이언트 설정

아래 예시는 로컬에 clone한 저장소를 직접 실행하는 방식입니다. `args`의 경로는 본인 PC의 절대 경로로 바꾸세요.

```json
{
  "mcpServers": {
    "flow-team": {
      "command": "node",
      "args": ["/ABSOLUTE/PATH/TO/flow-team-mcp/dist/index.js"],
      "env": {
        "FLOW_API_KEY": "YOUR_FLOW_API_KEY"
      }
    }
  }
}
```

예를 들어 이 저장소가 `/Users/me/Projects/flow-team-mcp`에 있다면:

```json
{
  "mcpServers": {
    "flow-team": {
      "command": "node",
      "args": ["/Users/me/Projects/flow-team-mcp/dist/index.js"],
      "env": {
        "FLOW_API_KEY": "YOUR_FLOW_API_KEY"
      }
    }
  }
}
```

클라이언트별 자세한 설정 방법:

- [Windows/macOS 설치 가이드](docs/installation.md)
- [Codex에서 사용하기](docs/codex.md)
- [Claude Code에서 사용하기](docs/claude-code.md)

### `npm link` 사용하기

전역 명령으로 연결하고 싶다면:

```bash
npm install
npm run build
npm link
```

그 다음 MCP 클라이언트 설정에서 `flow-team-mcp` 명령을 사용할 수 있습니다.

```json
{
  "mcpServers": {
    "flow-team": {
      "command": "flow-team-mcp",
      "env": {
        "FLOW_API_KEY": "YOUR_FLOW_API_KEY"
      }
    }
  }
}
```

## 환경변수

| 이름 | 필수 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `FLOW_API_KEY` | 예 | - | Flow OpenAPI 호출에 사용할 API Key입니다. |
| `FLOW_API_BASE_URL` | 아니오 | `https://api.flow.team` | Flow API base URL입니다. 테스트 또는 프록시 환경에서만 변경하세요. |

각 도구 호출에서 `apiKey`, `baseUrl` 입력값을 직접 넘기면 환경변수보다 우선합니다.

## 제공 도구

### 공통 도구

| 도구 | 설명 |
| --- | --- |
| `list_flow_endpoints` | 서버에 등록된 Flow OpenAPI 엔드포인트 목록을 조회합니다. `version`, `group`, `method`, `search`로 필터링할 수 있습니다. |
| `get_flow_endpoint` | 엔드포인트 ID로 HTTP method, path, docs URL 같은 메타데이터를 조회합니다. |
| `flow_request` | `endpointId` 또는 직접 지정한 `method` / `path`로 Flow OpenAPI를 호출합니다. |

### 프로젝트 도구

| 도구 | 설명 |
| --- | --- |
| `get_project_api_schema` | 프로젝트 API의 request, response, error 문서 정보를 조회합니다. |
| `list_projects` | Flow 프로젝트 목록을 조회합니다. |
| `list_participant_projects` | 특정 사용자가 참여 중인 프로젝트 목록을 조회합니다. |
| `get_project_participants` | 특정 프로젝트의 참여자 목록을 조회합니다. |
| `get_project_columns` | 특정 프로젝트의 컬럼 목록을 조회합니다. |
| `get_project_status_columns` | 특정 프로젝트의 상태 컬럼 목록을 조회합니다. |
| `create_project` | 새 Flow 프로젝트를 생성합니다. |
| `add_project_participants` | 프로젝트에 참여자를 추가합니다. |

## 프롬프트 예시

MCP 클라이언트에서 다음처럼 요청할 수 있습니다.

```text
Flow 프로젝트 목록 조회해줘.
```

```text
projectId가 123000인 프로젝트의 참여자 목록 조회해줘.
```

```text
Flow API에서 chats 관련 endpoint 목록 찾아줘.
```

```text
Flow endpoint id가 post_v1_bots_botId_notifications인 API 메타데이터 보여줘.
```

## 도구 입력 예시

### `list_projects`

```json
{
  "cursor": "0"
}
```

### `get_project_participants`

```json
{
  "projectId": "123000"
}
```

### `create_project`

```json
{
  "registerId": "company@company.name",
  "title": "테스트 프로젝트",
  "description": "이 프로젝트는 OpenAPI로 생성되었습니다.",
  "defaultTab": "feed"
}
```

### `add_project_participants`

```json
{
  "projectId": "123000",
  "registerId": "company@company.name",
  "participants": [
    {
      "participantId": "user@company.name"
    }
  ]
}
```

### `flow_request`

`endpointId`를 사용하는 방식:

```json
{
  "endpointId": "get_v1_projects_projectId_participants",
  "pathParams": {
    "projectId": "123000"
  }
}
```

직접 method와 path를 지정하는 방식:

```json
{
  "method": "GET",
  "path": "/v1/projects/{projectId}/participants",
  "pathParams": {
    "projectId": "123000"
  }
}
```

## 개발

```bash
npm run typecheck
npm run build
```

주요 파일 구조:

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

## 문제 해결

### `FLOW_API_KEY 환경변수 또는 apiKey 입력값이 필요합니다.`

MCP 클라이언트 설정의 `env.FLOW_API_KEY`에 Flow API Key가 들어있는지 확인하세요. 클라이언트를 재시작해야 새 설정이 반영되는 경우가 많습니다.

### `Cannot find module .../dist/index.js`

`npm run build`를 먼저 실행했는지 확인하세요. TypeScript 소스는 `src/`에 있고, MCP 클라이언트는 빌드 결과물인 `dist/index.js`를 실행합니다.

### MCP 클라이언트에서 도구가 보이지 않음

- MCP 설정 JSON 문법이 올바른지 확인하세요.
- `args`가 절대 경로인지 확인하세요.
- 설정 변경 후 MCP 클라이언트를 완전히 재시작하세요.
- 로컬 저장소 위치를 옮겼다면 `args` 경로도 함께 수정하세요.

## 참고 사항

- 현재 서버는 stdio transport를 사용합니다.
- Flow API 응답은 원본 HTTP 상태, 헤더, body를 포함한 JSON 형태로 반환됩니다.
- 일부 API는 Flow 계정, 이용기관, 프로젝트 권한에 따라 실패할 수 있습니다.

## 라이선스

ISC
