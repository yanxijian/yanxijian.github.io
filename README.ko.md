# yanxijian.github.io

**한국어** · [English](README.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md)

<!-- translated-from: README.md sha256:6a9e00fc5f79 -->

공개 프로젝트의 개인 색인입니다. 안내만 하며 문서를 복제해 두지는 않습니다.

사이트: <https://yanxijian.github.io/>

- English: <https://yanxijian.github.io/en/>
- 中文: <https://yanxijian.github.io/zh/>
- 日本語: <https://yanxijian.github.io/ja/>
- 한국어: <https://yanxijian.github.io/ko/>

빌드 단계도, 서드파티 의존성도, CDN도 없습니다. 정적 페이지 다섯 장, 스타일시트 하나, 스크립트 하나뿐이며 GitHub Pages가 `main` 루트에서 그대로 서비스합니다(`.nojekyll`이 Jekyll을 끕니다).

## 구조

```
index.html            루트 페이지: 언어 분기와 클릭 가능한 링크(JS 없이도 동작)
zh/index.html         중국어 색인
en/index.html         영어 색인
ja/index.html         일본어 색인
ko/index.html         한국어 색인
assets/style.css      스타일(OS 색 구성표를 따르고 CJK는 시스템 글꼴 우선)
assets/site.js        루트 분기와 선택 언어 기억
tests/site.test.js    site.js 단위 테스트
.nojekyll             파일을 그대로 게시
```

## 언어 선택 방식

우선순위가 높은 것부터:

1. **루트** 페이지 URL의 `?lang=zh` / `?lang=en` / `?lang=ja` / `?lang=ko`(예: `/?lang=ja`)
2. 저장된 `localStorage` 값(전환 링크를 누를 때 기록)
3. `navigator.language`(`zh-CN`, `zh-TW`, `zh-Hans`는 `zh`, `en-*`는 `en`,
   `ja-*`는 `ja`, `ko-*`는 `ko`)
4. 아무것도 없으면 영어

의도한 제약:

- **분기하는 것은 루트 페이지뿐**입니다. `/zh/`, `/en/`, `/ja/`, `/ko/`는 자기 URL을 바꾸지 않으므로 공유된 깊은 링크는 보낸 사람이 둔 자리에 그대로 남습니다(즉 `?lang=`은 루트 페이지에서만 의미가 있고, 내용 페이지는 전환 링크를 씁니다).
- 분기는 `location.replace`를 쓰므로 방문 기록을 늘리지 않고 뒤로 가기도 자연스럽습니다.
- 언어 전환은 그냥 링크이며 **JavaScript가 필요 없습니다**. JS는 선택을 기록할 뿐입니다.
- `localStorage`를 쓸 수 없으면(시크릿 모드, 저장소 비활성) 조용히 포기합니다.
- 루트 페이지에는 눈에 보이는 네 언어 링크와 `hreflang` 대체를 남기므로 크롤러와 JS 없는 방문자에게도 입구가 있습니다.

## 프로젝트 추가

네 개의 내용 페이지(`zh/`, `en/`, `ja/`, `ko/`의 `index.html`)를 고치고 각각에 `<li>` 하나를 넣습니다:

```html
<li>
  <a class="name" href="https://github.com/yanxijian/<repo>"><code><repo></code></a>
  <span class="desc">One-line description</span>
  <span class="tags">
    <a class="tag" href="https://github.com/yanxijian/<repo>/blob/HEAD/README.md">English</a>
    <a class="tag" href="https://github.com/yanxijian/<repo>/blob/HEAD/README.zh-CN.md">中文</a>
  </span>
</li>
```

링크는 모두 `blob/HEAD/README.md` 형태입니다. `HEAD`는 각 저장소의 기본 브랜치를 가리키므로 `main`과 `master` 사이에서 이름이 바뀌어도 여기서 고칠 필요가 없습니다.

**공개** 저장소만 싣습니다. 비공개(배포 키트, 워크스페이스 메타 저장소, Rime 관련)는 표시하지 않습니다.

## 로컬에서 보기

```bash
python -m http.server 8000
# http://localhost:8000/ 열기
```

페이지가 절대 경로(`/assets/...`, `/zh/`)를 쓰므로 정적 서버는 **저장소 루트**에서 띄우세요. 다른 디렉터리에서는 404가 납니다.

## 테스트

```bash
node --test
```

여섯 묶음의 단언이 언어 정규화, 네 단계 우선순위, `?lang` 파싱, 루트 페이지 판정, 분기 대상 구성을 확인합니다. 인자 없는 `node --test`는 `tests/` 아래를 자동으로 찾습니다.

## 배포

저장소 Settings → Pages → Source: `Deploy from a branch` → `main` / `/ (root)`. `.nojekyll`이 있으므로 Pages는 파일을 그대로 게시하고(Jekyll 빌드 없음), `main`에 push하면 사이트가 갱신됩니다.

## 저장소 규칙

이 저장소는 [RepoRules](https://github.com/yanxijian/RepoRules)로 검사하므로 기계적 규칙이 기억이 아니라 프로그램에 있습니다:

```bash
python scripts/repo_rules.py check --config repo-rules.json
```

- 인코딩/줄바꿈: `*.html`, `*.css`, `*.js`, `*.md`, `*.json`, `*.yml`, `*.sh`는 BOM 없음, LF만
- 열 너비: `*.js`는 140열 이내
- 필수 파일: 세 페이지, 두 에셋, 테스트, `.nojekyll`, `LICENSE`가 있어야 함
- Markdown: 로컬 링크가 풀려야 하고, 네 개의 README가 정해진 순서로 서로를 가리켜야 함

클론마다 한 번 훅을 설치합니다:

```bash
git config core.hooksPath .githooks
```

`scripts/repo_rules.py`는 내장 사본입니다. **손으로 고치지 마세요**. RepoRules 릴리스 뒤에는 RepoRules 체크아웃에서 `python repo_rules.py sync --root <this repo> --hook`을 실행합니다. `.github/workflows/hygiene.yml`이 push마다 같은 검사를 하고, 사본이 업스트림보다 뒤지면 실패합니다(`sync --check`).

## 알고 있는 절충

- `zh-TW` / `zh-HK`는 지금은 중국어 간체 페이지로 갑니다(번체판이 없음).
- 이 사이트는 색인이며 README를 **복제하지 않습니다**. 장점은 문서 사본 두 개가 어긋날 일이 없다는 것, 대가는 링크를 따라가면 이 사이트를 떠난다는 것입니다.
- 사이트 자체도 네 언어(中文, English, 日本語, 한국어)를 제공합니다. `zh-TW` / `zh-HK`는 지금도 중국어 간체 페이지로 갑니다.
