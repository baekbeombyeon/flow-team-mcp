# Codex에서 flow-team-mcp 사용하기

이 문서는 `flow-team-mcp`를 Codex의 로컬 stdio MCP 서버로 연결하는 방법을 설명합니다.

공식 참고 문서: <https://developers.openai.com/codex/codex-manual.md>

## 준비 사항

- Node.js 20 이상
- Codex CLI 또는 Codex IDE extension
- Flow OpenAPI Key
- 이 저장소를 로컬에 clone하고 build한 상태

```bash
git clone <repository-url>
cd flow-team-mcp
npm install
npm run build
```

## 방법 1: `codex mcp`로 추가하기

아무 디렉터리에서 다음 명령을 실행합니다.

```bash
codex mcp add \
  --env FLOW_API_KEY=YOUR_FLOW_API_KEY \
  flow-team \
  -- node /ABSOLUTE/PATH/TO/flow-team-mcp/dist/index.js
```

`/ABSOLUTE/PATH/TO/flow-team-mcp`는 본인 PC에 clone한 저장소의 절대 경로로 바꾸세요.

Flow API base URL을 직접 지정해야 한다면 다음처럼 추가합니다.

```bash
codex mcp add \
  --env FLOW_API_KEY=YOUR_FLOW_API_KEY \
  --env FLOW_API_BASE_URL=https://api.flow.team \
  flow-team \
  -- node /ABSOLUTE/PATH/TO/flow-team-mcp/dist/index.js
```

## 방법 2: `config.toml`에 직접 설정하기

Codex는 기본적으로 `~/.codex/config.toml`에서 MCP 설정을 읽습니다. 신뢰한 프로젝트에서는 프로젝트 범위의 `.codex/config.toml`도 사용할 수 있습니다.

```toml
[mcp_servers.flow-team]
command = "node"
args = ["/ABSOLUTE/PATH/TO/flow-team-mcp/dist/index.js"]

[mcp_servers.flow-team.env]
FLOW_API_KEY = "YOUR_FLOW_API_KEY"
```

Flow API base URL을 직접 지정해야 한다면:

```toml
[mcp_servers.flow-team]
command = "node"
args = ["/ABSOLUTE/PATH/TO/flow-team-mcp/dist/index.js"]

[mcp_servers.flow-team.env]
FLOW_API_KEY = "YOUR_FLOW_API_KEY"
FLOW_API_BASE_URL = "https://api.flow.team"
```

## 방법 3: `npm link` 사용하기

`dist/index.js` 절대 경로 대신 `flow-team-mcp` 명령어로 실행하고 싶다면:

```bash
cd flow-team-mcp
npm install
npm run build
npm link
```

그 다음 Codex 설정에 다음처럼 추가합니다.

```toml
[mcp_servers.flow-team]
command = "flow-team-mcp"

[mcp_servers.flow-team.env]
FLOW_API_KEY = "YOUR_FLOW_API_KEY"
```

## 연결 확인

Codex TUI에서 다음 명령을 실행합니다.

```text
/mcp
```

`flow-team` 서버와 도구 목록이 보이면 정상입니다.

다음 프롬프트로 동작을 확인할 수 있습니다.

```text
Flow 프로젝트 목록 조회해줘.
```

## 문제 해결

### `Cannot find module .../dist/index.js`

`flow-team-mcp` 저장소에서 `npm run build`를 실행했는지 확인하세요. 그리고 `args` 경로가 실제 `dist/index.js` 파일을 가리키는지 확인하세요.

### `FLOW_API_KEY 환경변수 또는 apiKey 입력값이 필요합니다.`

MCP 서버 설정의 `env` 블록에 `FLOW_API_KEY`를 넣거나, `codex mcp add --env FLOW_API_KEY=...`로 전달하세요.

### MCP 서버가 보이지 않음

- MCP 설정을 바꾼 뒤 Codex를 재시작하세요.
- `/mcp` 명령으로 서버 상태를 확인하세요.
- 설정한 경로가 절대 경로인지 확인하세요.
- 프로젝트 범위의 `.codex/config.toml`을 사용한다면 해당 프로젝트가 Codex에서 신뢰된 상태인지 확인하세요.
