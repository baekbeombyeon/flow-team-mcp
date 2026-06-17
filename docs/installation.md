# Windows/macOS 설치 가이드

이 문서는 `flow-team-mcp`를 로컬에서 사용하기 전에 필요한 Git, Node.js, npm 설치 방법을 정리합니다.

공식 참고 문서:

- Node.js 다운로드: <https://nodejs.org/en/download>
- npm의 Node.js/npm 설치 안내: <https://docs.npmjs.com/downloading-and-installing-node-js-and-npm/>
- Git for Windows: <https://git-scm.com/install/windows>
- Git for macOS: <https://git-scm.com/install/mac>

## 필요한 도구

- Git
- Node.js 20 이상
- npm

Node.js를 설치하면 npm도 함께 설치됩니다. 일반 사용자는 Node.js 공식 다운로드 페이지에서 LTS 버전을 설치하는 방식을 권장합니다.

## 사용할 버전 선택하기

`flow-team-mcp`는 Git으로 받아서 사용하는 방식입니다. 사용 목적에 따라 `main` 브랜치 또는 특정 tag를 선택하세요.

### 최신 버전 사용: `main`

최신 문서, 도구, 수정 사항을 바로 사용하고 싶다면 `main` 브랜치를 사용합니다.

```bash
git clone <repository-url>
cd flow-team-mcp
npm install
npm run build
```

이미 clone한 저장소를 최신 상태로 갱신하려면:

```bash
cd flow-team-mcp
git checkout main
git pull origin main
npm install
npm run build
```

`main`은 최신 변경 사항을 포함하지만, 특정 tag보다 안정성이 낮을 수 있습니다. 팀 내부에서 빠르게 최신 기능을 확인하거나 개발에 참여할 때 적합합니다.

### 안정 버전 사용: tag

팀원 모두 같은 버전을 사용하거나 문제 재현이 필요하다면 tag를 사용하는 편이 좋습니다.

현재 사용 가능한 tag는 `git tag --list` 또는 GitHub Releases에서 확인할 수 있습니다. 예시:

    v0.1.0

처음 clone할 때 특정 tag를 사용하려면:

```bash
git clone <repository-url>
cd flow-team-mcp
git checkout v0.1.0
npm install
npm run build
```

이미 clone한 저장소에서 tag로 이동하려면:

```bash
cd flow-team-mcp
git fetch --tags
git checkout v0.1.0
npm install
npm run build
```

tag로 checkout하면 detached HEAD 상태가 됩니다. 단순히 해당 버전을 사용하는 목적이라면 정상입니다. 수정 작업을 하려면 `main`에서 새 브랜치를 만들어 작업하세요.

## Windows

### 1. Git 설치

1. Git for Windows 다운로드 페이지로 이동합니다.
   - <https://git-scm.com/install/windows>
2. `Git for Windows/x64 Setup` 또는 본인 PC에 맞는 설치 파일을 내려받습니다.
3. 설치 마법사를 실행합니다.
4. 특별한 이유가 없다면 기본 옵션 그대로 설치합니다.
5. 설치가 끝나면 PowerShell 또는 Git Bash를 열고 확인합니다.

```powershell
git --version
```

버전이 출력되면 정상입니다.

### 2. Node.js 설치

1. Node.js 다운로드 페이지로 이동합니다.
   - <https://nodejs.org/en/download>
2. `LTS` 버전을 선택합니다.
3. Windows Installer를 내려받아 실행합니다.
4. 설치가 끝나면 PowerShell을 새로 열고 확인합니다.

```powershell
node --version
npm --version
```

`node`와 `npm` 버전이 모두 출력되면 정상입니다.

### 3. flow-team-mcp 설치

PowerShell에서 다음 명령을 실행합니다.

```powershell
git clone <repository-url>
cd flow-team-mcp
npm install
npm run build
```

빌드가 끝난 뒤 MCP 클라이언트 설정에는 Windows 절대 경로를 넣습니다.

예시:

```json
{
  "mcpServers": {
    "flow-team": {
      "command": "node",
      "args": ["C:\\Users\\me\\Projects\\flow-team-mcp\\dist\\index.js"],
      "env": {
        "FLOW_API_KEY": "YOUR_FLOW_API_KEY"
      }
    }
  }
}
```

JSON에서는 Windows 경로의 `\`를 `\\`로 이스케이프해야 합니다.

## macOS

macOS에서는 Homebrew를 사용하는 방법과 공식 Node.js 설치 파일을 사용하는 방법 중 하나를 선택하면 됩니다.

### 1. Git 설치

먼저 터미널에서 Git이 이미 설치되어 있는지 확인합니다.

```bash
git --version
```

버전이 출력되면 추가 설치가 필요 없습니다.

설치되어 있지 않다면 아래 방법 중 하나를 사용합니다.

#### 방법 A: Xcode Command Line Tools

```bash
xcode-select --install
```

설치 후 새 터미널을 열고 확인합니다.

```bash
git --version
```

#### 방법 B: Homebrew

Homebrew를 사용 중이라면 다음 명령으로 설치할 수 있습니다.

```bash
brew install git
git --version
```

### 2. Node.js 설치

#### 방법 A: 공식 설치 파일 사용

1. Node.js 다운로드 페이지로 이동합니다.
   - <https://nodejs.org/en/download>
2. `LTS` 버전을 선택합니다.
3. macOS Installer를 내려받아 실행합니다.
4. 설치가 끝나면 새 터미널을 열고 확인합니다.

```bash
node --version
npm --version
```

#### 방법 B: Homebrew 사용

Homebrew를 사용 중이라면 다음 명령으로 설치할 수 있습니다.

```bash
brew install node
node --version
npm --version
```

여러 프로젝트에서 Node.js 버전을 자주 바꿔야 한다면 `nvm`, `fnm`, `volta` 같은 버전 매니저를 사용할 수 있습니다. 처음 설치하는 사용자는 공식 LTS 설치 파일 또는 Homebrew 방식이 가장 단순합니다.

### 3. flow-team-mcp 설치

터미널에서 다음 명령을 실행합니다.

```bash
git clone <repository-url>
cd flow-team-mcp
npm install
npm run build
```

빌드가 끝난 뒤 MCP 클라이언트 설정에는 macOS 절대 경로를 넣습니다.

예시:

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

## 공통 확인

설치가 끝난 뒤 저장소 루트에서 다음 명령을 실행합니다.

```bash
npm run typecheck
npm run build
```

둘 다 실패 없이 끝나면 MCP 서버를 사용할 준비가 된 상태입니다.

## 자주 발생하는 문제

### `git` 명령을 찾을 수 없음

- Windows: Git for Windows 설치 후 PowerShell을 새로 열어보세요.
- macOS: `xcode-select --install` 또는 `brew install git`으로 Git을 설치하세요.

### `node` 또는 `npm` 명령을 찾을 수 없음

- Node.js 설치 후 터미널을 새로 열어보세요.
- 그래도 안 되면 Node.js가 PATH에 등록되어 있는지 확인하세요.
- Windows에서는 설치 중 `Add to PATH` 옵션이 꺼져 있지 않았는지 확인하세요.

### `Cannot find module .../dist/index.js`

`npm run build`를 먼저 실행했는지 확인하세요. MCP 클라이언트는 TypeScript 원본이 아니라 빌드 결과물인 `dist/index.js`를 실행합니다.
