# yanxijian.github.io

**English** · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [한국어](README.ko.md)

A personal index of my public projects. Navigation only — no copies of the docs.

Site: <https://yanxijian.github.io/>

- English: <https://yanxijian.github.io/en/>
- 中文: <https://yanxijian.github.io/zh/>
- 日本語: <https://yanxijian.github.io/ja/>
- 한국어: <https://yanxijian.github.io/ko/>

No build step, no third-party dependencies, no CDN: five static pages, one stylesheet and one
script, served by GitHub Pages straight from the root of `main` (`.nojekyll` disables Jekyll).

## Layout

```
index.html            root page: language redirect plus clickable links (works without JS)
zh/index.html         Chinese index
en/index.html         English index
ja/index.html         Japanese index
ko/index.html         Korean index
assets/style.css      styling (follows the OS colour scheme, prefers system CJK fonts)
assets/site.js        root redirect and remembered language
tests/site.test.js    unit tests for site.js
.nojekyll             publish the files as-is
```

## How the language is chosen

Highest priority first:

1. `?lang=zh` / `?lang=en` / `?lang=ja` / `?lang=ko` in the **root** page URL
   (for example `/?lang=ja`);
2. the stored `localStorage` value (written when a switch link is clicked);
3. `navigator.language` (`zh-CN`, `zh-TW`, `zh-Hans` map to `zh`; `en-*` to `en`;
   `ja-*` to `ja`; `ko-*` to `ko`);
4. English as the fallback.

Deliberate constraints:

- **Only the root page redirects.** `/zh/`, `/en/`, `/ja/` and `/ko/` never rewrite their own URL, so shared
  deep links stay where the sender put them (which also means `?lang=` is only meaningful on the
  root page; content pages use the switch link).
- The redirect uses `location.replace`, so it adds no history entry and the back button behaves.
- Language switches are plain links and **do not require JavaScript**; JS only records the choice.
- If `localStorage` is unavailable (private mode, disabled storage) it degrades silently.
- The root page keeps visible links in all four languages and `hreflang` alternates, so crawlers and no-JS
  visitors still get an entry point.

## Adding a project

Edit the four content pages (`zh/`, `en/`, `ja/`, `ko/` `index.html`) and add one `<li>` to each:

```html
<li>
  <a class="name" href="https://github.com/yanxijian/<repo>"><code><repo></code></a>
  <span class="desc">One-line description</span>
  <span class="tags">
    <a class="tag" href="https://github.com/yanxijian/<repo>/blob/HEAD/README.md">English</a>
    <a class="tag" href="https://github.com/yanxijian/<repo>/blob/HEAD/README.zh-CN.md">中文</a>
    <a class="tag" href="https://github.com/yanxijian/<repo>/blob/HEAD/README.ja.md">日本語</a>
    <a class="tag" href="https://github.com/yanxijian/<repo>/blob/HEAD/README.ko.md">한국어</a>
  </span>
</li>
```

All links use `blob/HEAD/README.md`: `HEAD` follows each repository's default branch, so a rename
between `main` and `master` needs no change here.

Only **public** repositories are listed; private ones (deployment kits, the workspace meta repo,
the Rime work) are not shown.

## Local preview

```bash
python -m http.server 8000
# open http://localhost:8000/
```

The pages use absolute paths (`/assets/...`, `/zh/`), so start the static server from the
**repository root**; any other directory will 404.

## Tests

```bash
node --test
```

Six groups of assertions cover language normalisation, the four-level priority, `?lang` parsing,
root-page detection and redirect target construction. `node --test` without arguments
auto-discovers the cases under `tests/`.

## Deployment

Repository Settings → Pages → Source: `Deploy from a branch` → `main` / `/ (root)`.
With `.nojekyll` present, Pages publishes the files as-is (no Jekyll build); pushing to `main`
is enough to update the site.

## Repository rules

This repo is checked by [RepoRules](https://github.com/yanxijian/RepoRules), so the mechanical
rules live in a program instead of in memory:

```bash
python scripts/repo_rules.py check --config repo-rules.json
```

- Encoding/EOL: `*.html`, `*.css`, `*.js`, `*.md`, `*.json`, `*.yml`, `*.sh` — no BOM, LF only;
- Line width: `*.js` stays within 140 columns;
- Required files: the three pages, both assets, the test, `.nojekyll` and `LICENSE` must exist;
- Markdown: local links must resolve, and the four READMEs (`README.md`, `README.zh-CN.md`,
  `README.ja.md`, `README.ko.md`) must name each other in the configured order.

Install the hook once per clone:

```bash
git config core.hooksPath .githooks
```

`scripts/repo_rules.py` is a vendored copy — **do not edit it by hand**. After a RepoRules
release, run `python repo_rules.py sync --root <this repo> --hook` from a RepoRules checkout.
`.github/workflows/hygiene.yml` runs the same checks on every push and fails if the vendored
copy falls behind (`sync --check`).

## Known trade-offs

- `zh-TW` / `zh-HK` currently land on the Simplified Chinese page (there is no Traditional build).
- The site is an index and does **not** copy any README: the upside is that two copies of the
  docs can never drift apart; the downside is that following a link leaves this site.
