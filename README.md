# LP 制作メモ

## 概要
- 依頼内容の要約: `request.md`
- ヒアリング項目: `hearing.md`
- 静的サイト: `src/index.html`, `src/styles.css`

## 使い方
1) `hearing.md` を埋める（未定は未定でOK）
2) 回答を踏まえて文面を調整（必要に応じてこちらで原稿化）
3) `src/index.html` の文言と `#contact` セクションのメールを掲載用Gmailに差し替え
   - `id="contact"` の `data-email` 属性、`mailto:` の両方を同じ値に
4) ブラウザで `src/index.html` を開いて確認

## 連絡先の差し替え
- `src/index.html: 行末あたり`
  - `<section id="contact" ... data-email="yourname@gmail.com">`
  - `<a id="mailto" href="mailto:yourname@gmail.com">yourname@gmail.com</a>`
  - 上記3箇所を掲載用Gmailに変更してください。

## デプロイ（例: GitHub Pages）
- すでにGitHubリポジトリがある場合:
  - ルートに `src/` を配置したまま、Pages で `src` を公開対象にするか、`src` の内容をリポジトリ直下に配置してください。
  - ブランチ／公開設定はお好みで（例: `main` / `root`）。
- 新規で作成する場合:
  - リポジトリ作成後に、このフォルダの内容を push。
  - Pages を有効化し、公開対象を指定（ブランチ／フォルダ）。

## 次の作業（こちらで対応可能）
- ヒアリング回答を反映したLP原稿の具体化
- 文面の磨き込み（キャッチ・CTA・FAQ）
- 事例・図版・簡易ロゴの追加
- 日本語フォントや配色の最適化
- GitHub へのプッシュ／Pages 公開設定

