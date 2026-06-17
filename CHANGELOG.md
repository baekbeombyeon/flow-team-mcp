# 변경 이력

## v0.1.0

초기 릴리스입니다. Flow Team OpenAPI를 로컬 MCP 서버로 연결해 Codex, Claude Code 같은 MCP 클라이언트에서 사용할 수 있습니다.

### 주요 기능

- stdio 기반 MCP 서버 제공
- Flow OpenAPI 호출 공통 도구 제공
  - `list_flow_endpoints`
  - `get_flow_endpoint`
  - `flow_request`
- 프로젝트 API 전용 도구 제공
  - `get_project_api_schema`
  - `list_projects`
  - `list_participant_projects`
  - `get_project_participants`
  - `get_project_columns`
  - `get_project_status_columns`
  - `create_project`
  - `add_project_participants`
- `FLOW_API_KEY` 환경변수 기반 인증 지원
- `FLOW_API_BASE_URL` 환경변수로 API base URL 변경 지원
- path parameter, query, JSON body 처리 공통화
- Flow API 응답의 HTTP 상태, 헤더, body 반환

### 문서

- README에 로컬 설치, MCP 클라이언트 설정, 도구 목록, 입력 예시 추가
- Windows/macOS 기준 Git, Node.js, npm 설치 가이드 추가
- `main` 브랜치와 `v0.1.0` tag 기준 사용 방법 추가
- Codex 연결 가이드 추가
- Claude Code 연결 가이드 추가

### 참고

- 현재는 로컬 clone 후 `npm install`, `npm run build`로 사용하는 방식을 기준으로 합니다.
- npm 패키지 배포는 아직 제공하지 않습니다.
