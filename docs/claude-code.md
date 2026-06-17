# Claude Code에서 flow-team-mcp 사용하기

이 문서는 `flow-team-mcp`를 Claude Code의 로컬 stdio MCP 서버로 연결하는 방법을 설명합니다.

공식 참고 문서: <https://code.claude.com/docs/en/mcp>

## 준비 사항

- Node.js 20 이상
- Claude Code
- Flow OpenAPI Key
- 이 저장소를 로컬에 clone하고 build한 상태

```bash
git clone <repository-url>
cd flow-team-mcp
npm install
npm run build
```

## 방법 1: 개인 로컬 서버로 추가하기

서버 경로나 인증 정보가 개인 PC에만 해당한다면 `local` scope를 사용하세요.

```bash
claude mcp add \
  --transport stdio \
  --env FLOW_API_KEY=YOUR_FLOW_API_KEY \
  --scope local \
  flow-team \
  -- node /ABSOLUTE/PATH/TO/flow-team-mcp/dist/index.js
```

Flow API base URL을 직접 지정해야 한다면:

```bash
claude mcp add \
  --transport stdio \
  --env FLOW_API_KEY=YOUR_FLOW_API_KEY \
  --env FLOW_API_BASE_URL=https://api.flow.team \
  --scope local \
  flow-team \
  -- node /ABSOLUTE/PATH/TO/flow-team-mcp/dist/index.js
```

`--` 구분자는 필요합니다. `--` 뒤의 값은 Claude Code가 MCP 서버를 실행할 때 사용할 명령입니다.

## 방법 2: 프로젝트 범위 서버로 추가하기

`project` scope를 사용하면 프로젝트 루트에 `.mcp.json` 파일이 생성됩니다. 이 방식은 팀이 같은 MCP 서버 정의를 공유할 때 유용합니다.

단, 커밋해도 안전한 설정만 넣어야 합니다. 실제 API Key는 절대 커밋하지 마세요.

```bash
claude mcp add \
  --transport stdio \
  --scope project \
  flow-team \
  -- node /ABSOLUTE/PATH/TO/flow-team-mcp/dist/index.js
```

그 다음 `.mcp.json`을 수정해서 민감 정보는 환경변수로 주입되게 만듭니다.

```json
{
  "mcpServers": {
    "flow-team": {
      "type": "stdio",
      "command": "node",
      "args": ["/ABSOLUTE/PATH/TO/flow-team-mcp/dist/index.js"],
      "env": {
        "FLOW_API_KEY": "${FLOW_API_KEY}",
        "FLOW_API_BASE_URL": "${FLOW_API_BASE_URL:-https://api.flow.team}"
      }
    }
  }
}
```

각 사용자는 Claude Code를 시작하기 전에 본인의 API Key를 환경변수로 설정합니다.

```bash
export FLOW_API_KEY="YOUR_FLOW_API_KEY"
claude
```

Claude Code는 `.mcp.json`에 정의된 프로젝트 범위 MCP 서버를 사용하기 전에 승인 요청을 표시합니다.

## 방법 3: `npm link` 사용하기

`dist/index.js` 절대 경로 대신 `flow-team-mcp` 명령어로 실행하고 싶다면:

```bash
cd flow-team-mcp
npm install
npm run build
npm link
```

그 다음 Claude Code에 다음처럼 추가합니다.

```bash
claude mcp add \
  --transport stdio \
  --env FLOW_API_KEY=YOUR_FLOW_API_KEY \
  --scope local \
  flow-team \
  -- flow-team-mcp
```

## 연결 확인

설정된 MCP 서버 목록을 확인합니다.

```bash
claude mcp list
```

Claude Code 안에서는 다음 명령을 실행합니다.

```text
/mcp
```

다음 프롬프트로 동작을 확인할 수 있습니다.

```text
Flow 프로젝트 목록 조회해줘.
```

## 문제 해결

### `Cannot find module .../dist/index.js`

`flow-team-mcp` 저장소에서 `npm run build`를 실행했는지 확인하세요. 그리고 설정한 경로가 실제 `dist/index.js` 파일을 가리키는지 확인하세요.

### `FLOW_API_KEY 환경변수 또는 apiKey 입력값이 필요합니다.`

`--env`, shell 환경변수, 또는 `.mcp.json`의 `env` 블록을 통해 `FLOW_API_KEY`를 설정하세요.

### 프로젝트 `.mcp.json` 승인이 필요함

Claude Code를 대화형으로 실행한 뒤 `/mcp` 패널에서 프로젝트 범위 MCP 서버를 승인하세요.

### 서버 이름 충돌

고유한 서버 이름을 사용하세요. Claude Code는 `workspace` 같은 일부 내부 이름을 예약해 둡니다.
