# yanxijian.github.io

**简体中文** · [English](README.md) · [日本語](README.ja.md) · [한국어](README.ko.md)

个人项目索引站：只做导航，不放文档副本。

站点地址：<https://yanxijian.github.io/>

- 中文：<https://yanxijian.github.io/zh/>
- English: <https://yanxijian.github.io/en/>

这里没有构建步骤、没有第三方依赖、没有 CDN：三个静态页面 + 一个 CSS + 一个 JS 文件，
由 GitHub Pages 直接从 `main` 分支根目录托管（`.nojekyll` 关闭 Jekyll 处理）。

## 目录

```
index.html            根页：按语言偏好跳转，同时提供可点击的双语链接（无 JS 兜底）
zh/index.html         中文索引
en/index.html         英文索引
assets/style.css      样式（跟随系统深浅色，系统中文字体优先）
assets/site.js        根页跳转 + 语言偏好记忆
tests/site.test.js    site.js 的单元测试
.nojekyll             让 Pages 直接按静态文件发布
```

## 语言选择规则

按优先级从高到低：

1. **根页**地址里的 `?lang=zh` / `?lang=en`（例如 `/?lang=en`）；
2. `localStorage` 里记住的上次选择（点过切换链接即写入）；
3. `navigator.language`（`zh-CN`、`zh-TW`、`zh-Hans` 都归到 `zh`，`en-*` 归到 `en`）；
4. 都没有时用英文页。

几个刻意的约束：

- **只有根页会跳转**，`/zh/`、`/en/` 的地址永远不变，分享出去的深链不会被改写
  （所以 `?lang=` 只在根页有意义，内容页用页面上的切换链接）；
- 跳转用 `location.replace`，不往浏览历史里塞一条中转页，返回键行为正常；
- 语言切换是普通链接，**不依赖 JS**；JS 只负责把偏好写进 `localStorage`；
- `localStorage` 不可用（隐私模式、被禁用）时静默降级，跳转照常工作；
- 根页保留可见的双语链接与 `hreflang`，无 JS 与爬虫也能拿到入口。

## 新增一个项目

改两个文件：`zh/index.html` 与 `en/index.html`，各自加一个 `<li>`：

```html
<li>
  <a class="name" href="https://github.com/yanxijian/<repo>"><code><repo></code></a>
  <span class="desc">一句话说明</span>
  <span class="tags">
    <a class="tag" href="https://github.com/yanxijian/<repo>/blob/HEAD/README.md">English</a>
    <a class="tag" href="https://github.com/yanxijian/<repo>/blob/HEAD/README.zh-CN.md">中文</a>
    <a class="tag" href="https://github.com/yanxijian/<repo>/blob/HEAD/README.ja.md">日本語</a>
    <a class="tag" href="https://github.com/yanxijian/<repo>/blob/HEAD/README.ko.md">한국어</a>
  </span>
</li>
```

链接统一用 `blob/HEAD/README.md`：`HEAD` 跟随各仓默认分支，分支改名（`main`/`master`）都不用动这里。

只收录**公开**仓库；私有仓（部署脚本、工作区元仓库、rime 相关）不出现在榜单上。

## 本地预览

```bash
python -m http.server 8000
# 打开 http://localhost:8000/
```

页面用的是绝对路径（`/assets/...`、`/zh/`），所以必须在**仓库根目录**启动静态服务器，
从别的目录起会 404。

## 测试

```bash
node --test
```

6 组断言覆盖语言归一化、四级优先级、`?lang` 解析、根页判定与跳转目标拼接。
`node --test` 不带参数时会自动发现 `tests/` 下的用例。

## 部署

仓库 Settings → Pages → Source: `Deploy from a branch` → `main` / `/ (root)`。
因为 `.nojekyll` 存在，Pages 原样发布文件，不做 Jekyll 构建；推送 `main` 即生效。

## 规范检查

本仓接入 [RepoRules](https://github.com/yanxijian/RepoRules)，把能机械判断的部分固化：

```bash
python scripts/repo_rules.py check --config repo-rules.json
```

- 编码/行尾：`*.html`、`*.css`、`*.js`、`*.md`、`*.json`、`*.yml`、`*.sh` 无 BOM + LF；
- 行宽：`*.js` 不超过 140 列；
- 必需文件：三个页面、两个资源、测试、`.nojekyll`、`LICENSE` 等缺一即失败；
- Markdown：本地链接必须能解析，四份 README（`README.md`、`README.zh-CN.md`、`README.ja.md`、`README.ko.md`）按约定顺序互相出现对方文件名。

装一次钩子（每份克隆各配一次）：

```bash
git config core.hooksPath .githooks
```

`scripts/repo_rules.py` 是随仓内置副本，**不要手改**；上游升级后在 RepoRules 检出里执行
`python repo_rules.py sync --root <本仓> --hook` 同步。`.github/workflows/hygiene.yml`
在每次推送时跑同样的检查，并校验内置副本没有落后（`sync --check`）。

## 已知取舍

- `zh-TW` / `zh-HK` 目前归到简体中文页（没有单独的繁体版本）；
- 站点只是索引，**不复制**各仓 README：好处是永远不出现“两份文档不同步”，
  代价是点进去会离开本站（新标签页打开由各人浏览器设置决定）。
