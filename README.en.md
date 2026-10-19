# yanxijian.github.io

**English** · [简体中文](README.md)

A personal index of my public projects. Navigation only — no copies of the docs.

Site: <https://yanxijian.github.io/>

- English: <https://yanxijian.github.io/en/>
- 中文: <https://yanxijian.github.io/zh/>

No build step, no third-party dependencies, no CDN: three static pages, one stylesheet and one
script, served by GitHub Pages straight from the root of `main` (`.nojekyll` disables Jekyll).

## Layout

```
index.html            root page: language redirect plus clickable links (works without JS)
zh/index.html         Chinese index
en/index.html         English index
assets/style.css      styling (follows the OS colour scheme, prefers system CJK fonts)
assets/site.js        root redirect and remembered language
tests/site.test.js    unit tests for site.js
.nojekyll             publish the files as-is
```

## How the language is chosen

Highest priority first:

1. `?lang=zh` / `?lang=en` in the **root** page URL (for example `/?lang=en`);
2. the stored `localStorage` value (written when a switch link is clicked);
3. `navigator.language` (`zh-CN`, `zh-TW`, `zh-Hans` all map to `zh`; `en-*` maps to `en`);
4. English as the fallback.

Deliberate constraints:

- **Only the root page redirects.** `/zh/` and `/en/` never rewrite their own URL, so shared
  deep links stay where the sender put them (which also means `?lang=` is only meaningful on the
  root page; content pages use the switch link).
- The redirect uses `location.replace`, so it adds no history entry and the back button behaves.
- Language switches are plain links and **do not require JavaScript**; JS only records the choice.
- If `localStorage` is unavailable (private mode, disabled storage) it degrades silently.
- The root page keeps visible bilingual links and `hreflang` alternates, so crawlers and no-JS
  visitors still get an entry point.

## Adding a project

Edit two files, `zh/index.html` and `en/index.html`, and add one `<li>` to each:

```html
<li>
  <a class="name" href="https://github.com/yanxijian/<repo>"><code><repo></code></a>
  <span class="desc">One-line description</span>
  <span class="tags">
    <a class="tag" href="https://github.com/yanxijian/<repo>/blob/HEAD/README.en.md">English</a>
    <a class="tag" href="https://github.com/yanxijian/<repo>/blob/HEAD/README.md">中文</a>
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

## Known trade-offs

- `zh-TW` / `zh-HK` currently land on the Simplified Chinese page (there is no Traditional build).
- The site is an index and does **not** copy any README: the upside is that two copies of the
  docs can never drift apart; the downside is that following a link leaves this site.
