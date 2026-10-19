# yanxijian.github.io

**日本語** · [English](README.md) · [简体中文](README.zh-CN.md) · [한국어](README.ko.md)

公開プロジェクトの個人的な索引です。案内だけを目的としており、ドキュメントの複製は置いていません。

サイト：<https://yanxijian.github.io/>

- English: <https://yanxijian.github.io/en/>
- 中文: <https://yanxijian.github.io/zh/>
- 日本語: <https://yanxijian.github.io/ja/>
- 한국어: <https://yanxijian.github.io/ko/>

ビルド手順もサードパーティ依存も CDN もありません。静的ページ 5 枚、スタイルシート 1 枚、スクリプト 1 本だけで、GitHub Pages が `main` のルートからそのまま配信します（`.nojekyll` が Jekyll を無効にします）。

## 構成

```
index.html            ルートページ：言語の振り分けと、クリックできるリンク（JS が無くても動く）
zh/index.html         中国語の索引
en/index.html         英語の索引
ja/index.html         日本語の索引
ko/index.html         韓国語の索引
assets/style.css      見た目（OS のカラースキームに追従し、CJK はシステムフォントを優先）
assets/site.js        ルートの振り分けと選択言語の記憶
tests/site.test.js    site.js の単体テスト
.nojekyll             ファイルをそのまま公開する
```

## 言語の決め方

優先度の高い順：

1. **ルート**ページの URL にある `?lang=zh` / `?lang=en` / `?lang=ja` / `?lang=ko`（例：`/?lang=ja`）
2. 保存された `localStorage` の値（切り替えリンクを押したときに書かれる）
3. `navigator.language`（`zh-CN`、`zh-TW`、`zh-Hans` は `zh`、`en-*` は `en`、
   `ja-*` は `ja`、`ko-*` は `ko`）
4. どれも無ければ英語

意図した制約：

- **振り分けるのはルートページだけ**です。`/zh/`、`/en/`、`/ja/`、`/ko/` は自分の URL を書き換えないので、共有された深いリンクは送った人の場所のまま残ります（つまり `?lang=` はルートページでのみ意味を持ち、内容ページは切り替えリンクを使います）。
- 振り分けは `location.replace` を使うので履歴を増やさず、戻るボタンも自然に動きます。
- 言語の切り替えはただのリンクで、**JavaScript は要りません**。JS は選択を記録するだけです。
- `localStorage` が使えない場合（プライベートモード、ストレージ無効）は黙って諦めます。
- ルートページには目に見える四言語のリンクと `hreflang` の代替を残すので、クローラーや JS の無い訪問者にも入口があります。

## プロジェクトの追加

4 つの内容ページ（`zh/`、`en/`、`ja/`、`ko/` の `index.html`）を編集し、それぞれに `<li>` を 1 つ足します：

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

リンクはすべて `blob/HEAD/README.md` の形です。`HEAD` は各リポジトリの既定ブランチを指すので、`main` と `master` の間で名前が変わってもここを直す必要はありません。

載せるのは**公開**リポジトリだけです。非公開のもの（デプロイ用キット、ワークスペースのメタリポジトリ、Rime 関連）は表示しません。

## ローカルで見る

```bash
python -m http.server 8000
# http://localhost:8000/ を開く
```

ページは絶対パス（`/assets/...`、`/zh/`）を使うので、静的サーバーは**リポジトリのルート**から起動してください。別のディレクトリだと 404 になります。

## テスト

```bash
node --test
```

6 組のアサーションが、言語の正規化、4 段階の優先度、`?lang` の解析、ルートページの判定、振り分け先の組み立てを確認します。引数なしの `node --test` は `tests/` の下を自動で拾います。

## 公開

リポジトリの Settings → Pages → Source：`Deploy from a branch` → `main` / `/ (root)`。`.nojekyll` があるので Pages はファイルをそのまま公開し（Jekyll のビルドは無し）、`main` へ push すればサイトが更新されます。

## リポジトリの規則

このリポジトリは [RepoRules](https://github.com/yanxijian/RepoRules) で検査しているので、機械的な規則は記憶ではなくプログラムにあります：

```bash
python scripts/repo_rules.py check --config repo-rules.json
```

- 文字コード／改行：`*.html`、`*.css`、`*.js`、`*.md`、`*.json`、`*.yml`、`*.sh` は BOM なし・LF のみ
- 桁幅：`*.js` は 140 桁以内
- 必須ファイル：3 つのページ、2 つのアセット、テスト、`.nojekyll`、`LICENSE` が存在すること
- Markdown：ローカルのリンクが解決でき、4 つの README が互いを正しい順序で指していること

クローンごとに 1 回、フックを入れます：

```bash
git config core.hooksPath .githooks
```

`scripts/repo_rules.py` は同梱の副本です。**手で編集しないでください**。RepoRules のリリース後は、RepoRules のチェックアウトで `python repo_rules.py sync --root <this repo> --hook` を実行します。`.github/workflows/hygiene.yml` が push のたびに同じ検査を行い、副本が上流より古いと失敗します（`sync --check`）。

## 承知のうえの割り切り

- `zh-TW` / `zh-HK` は今のところ簡体字のページに着地します（繁体字の版はありません）。
- このサイトは索引であり、README を**複製しません**。利点はドキュメントの二重管理が決して食い違わないこと、代償はリンクをたどるとこのサイトを離れることです。
- サイト自体も 4 言語（中文・English・日本語・한국어）を提供します。`zh-TW` / `zh-HK` は今も簡体字のページに着地します。
