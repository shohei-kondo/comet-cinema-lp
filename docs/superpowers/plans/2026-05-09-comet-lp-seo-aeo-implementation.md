# COMET LP SEO/AEO 実装計画

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `index.html` に CH01.5（デザイン D）、見出し階層（h1/h2/h3）、JSON-LD 3 種、meta/canonical/OGP を追加し、FAQPage の回答文とページ本文を完全一致させる。

**Architecture:** 単一ファイル `index.html` 内の Babel/React。`WhatIsEventSection` と `MangaBubble` を `FailureSection` と `SuccessSection` の間に挿入。`<style>` 先頭に見出しリセットを追加し、指定 6 箇所の div/span をセマンティックタグに置換。`<head>` に JSON-LD とメタを `<style>` の直前に挿入。

**Tech Stack:** HTML5、React 18 UMD、Babel standalone、インライン `style` / `className`（既存は変更しない方針）。

**参照仕様:** `docs/superpowers/specs/2026-05-08-comet-lp-seo-aeo-design.md`（v2）  
**参照実装:** `ch01-5-variants.jsx` の `MangaBubble`・`VariantD`・`ITEMS`

---

## ファイル責務

| ファイル | 責務 |
|----------|------|
| `index.html` | `<head>`（メタ・JSON-LD・CSS）、`WhatIsEventSection`・`MangaBubble`・`ITEMS` 定数、`App` の JSX 順序、各セクションの h2/h3 置換、FAQ と一致する本文の追記・修正、`@media` 内 `.pc-whatis-*` |
| `ch01-5-variants.jsx` | 参照のみ（本タスクでは編集しない） |

---

### Task 1: `<head>` に JSON-LD 3 種を挿入

**Files:**
- Modify: `index.html`（`<head>` 内、`<style>` の直前）

- [ ] **Step 1:** `<style>` の直前に、次の 3 つの `<script type="application/ld+json">` をこの順で貼り付ける。

**Organization（JSON 内の二重引用符は `\"` でエスケープすること）:**

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "COMET",
  "url": "https://comet-event.co.jp/",
  "logo": "https://comet-event.co.jp/uploads/logo_02.png",
  "description": "社内イベントを「組織課題を解く施策」として設計・運営する企業。",
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "sales",
    "url": "https://comet-event.co.jp/contact/"
  }
}
</script>
```

**WebPage（`url` は本番の確定パスに置換。初回デプロイ時は実 URL で上書き）:**

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "社内イベントは、「設計」で変わる。",
  "description": "失敗例と3つの実話マンガで学ぶ、組織を一つにする社内イベントの設計論。COMETが10年・150社以上を支援した経験から、目的設計・共体験・余韻設計の3点を解説。",
  "inLanguage": "ja",
  "url": "https://comet-event.co.jp/<確定パス>/",
  "isPartOf": {
    "@type": "WebSite",
    "name": "COMET",
    "url": "https://comet-event.co.jp/"
  },
  "primaryImageOfPage": "https://comet-event.co.jp/uploads/og-image.png",
  "datePublished": "2026-05-08",
  "dateModified": "2026-05-09"
}
</script>
```

**FAQPage（`mainEntity` の `text` は改行・句読点を含め仕様どおり。実装後 Task 7 で本文と照合）:**

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "社内イベントとは何ですか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "社内イベントは、単なるレクリエーションではなく、組織課題を解くための施策です。目的設計・実行・測定を伴う経営アクションであり、目的に応じて経営方針発表会・全社会議・社内表彰式・懇親会・オフサイトミーティング・新入社員歓迎会などの形式が選ばれます。"
      }
    },
    {
      "@type": "Question",
      "name": "なぜ社内イベントは「盛り上がらない」のか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "問題は予算でも規模でもなく、目的設計がなかったことです。「目的なきイベント」は、お金と時間を消費するだけで、組織には何も残りません。"
      }
    },
    {
      "@type": "Question",
      "name": "社内イベントを成功させるポイントは？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "3点あります。①目的を先に設計する：何を変えたいかから逆算する。②「体験」で関係をつくる：講演ではなく共体験で心理的距離を縮める。③余韻を設計に組み込む：イベント後の行動変容まで見越す。"
      }
    },
    {
      "@type": "Question",
      "name": "社内イベントはコストですか？投資ですか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "設計次第で投資になります。楽しいだけ・盛り上がるだけで終わらず、その後の働き方につながるイベント設計が、投資対効果を引き上げます。"
      }
    },
    {
      "@type": "Question",
      "name": "COMETはどんな会社ですか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "10年・150社以上・300件以上の実績を持つ、社内イベント設計・運営の専門企業。経営方針発表会から懇親会まで、目的別に最適なイベントを設計します。無料相談から対応可能です。"
      }
    }
  ]
}
</script>
```

- [ ] **Step 2:** ブラウザで `index.html` を開き、開発者ツール Elements で `<head>` にスクリプトが 3 つあることを確認。

- [ ] **Step 3:** リッチリザルトテスト（ローカルは「コードスニペット」で JSON のみでも可）でパースエラーがないことを確認。

- [ ] **Step 4:** コミット

```bash
git add index.html
git commit -m "feat(seo): add Organization, WebPage, FAQPage JSON-LD"
```

---

### Task 2: `<head>` の title / description / canonical / OGP / Twitter

**Files:**
- Modify: `index.html:6-10` 付近（既存 `<title>` 行を置換し、その直下に追記）

- [ ] **Step 1:** 既存の 1 行

```html
<title>社内イベントで組織が変わる | COMET</title>
```

を次に置換する。

```html
<title>社内イベントは、「設計」で変わる。｜COMET</title>
<meta name="description" content="失敗例と3つの実話マンガで学ぶ、社内イベントの設計論。目的設計・共体験・余韻設計の3点が、組織を変えます。COMETが10年・150社以上を支援。無料相談受付中。">
<link rel="canonical" href="https://comet-event.co.jp/<確定パス>/">
<meta property="og:type" content="website">
<meta property="og:title" content="社内イベントは、「設計」で変わる。｜COMET">
<meta property="og:description" content="失敗例と3つの実話マンガで学ぶ、組織を変える社内イベントの設計論。">
<meta property="og:url" content="https://comet-event.co.jp/<確定パス>/">
<meta property="og:image" content="https://comet-event.co.jp/uploads/og-image.png">
<meta property="og:site_name" content="COMET">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="社内イベントは、「設計」で変わる。｜COMET">
<meta name="twitter:description" content="失敗例と3つの実話マンガで学ぶ、組織を変える社内イベントの設計論。">
<meta name="twitter:image" content="https://comet-event.co.jp/uploads/og-image.png">
```

- [ ] **Step 2:** `<確定パス>/` を本番 URL に差し替え（暫定のままコミットしない運用ルールに従う）。

- [ ] **Step 3:** コミット

```bash
git add index.html
git commit -m "feat(seo): update title, meta description, canonical, OGP, Twitter"
```

---

### Task 3: 見出しリセット CSS を `<style>` 先頭に追加

**Files:**
- Modify: `index.html:11`（`<style>` 直後の `*` ルールの前）

- [ ] **Step 1:** `<style>` の直後（現在の `* { box-sizing: ...` の前）に次を挿入する。

```css
h1, h2, h3, h4 {
  all: unset;
  display: block;
}
h3 { display: inherit; }
```

- [ ] **Step 2:** ブラウザで Hero の見た目が変わっていないか確認（`h1` にリセットが乗るため）。

- [ ] **Step 3:** コミット

```bash
git add index.html
git commit -m "feat(a11y-seo): reset heading browser defaults for h1-h4"
```

---

### Task 4: チャプター見出しの div/span → h2/h3 置換

**Files:**
- Modify: `index.html`（行番号は実装時のファイルに合わせて検索）

- [ ] **Step 1 — FailureSection（CH01 タイトル）:**  
  `className="pc-fh-title"` の `<div` を `<h2` に変更。閉じタグを `</h2>` に。`className` と `style={{ ... }}` はそのまま。

  当箇所（現行）:

```223:225:index.html
        <div className="pc-fh-title" style={{ color: '#fff', fontSize: 18, fontWeight: 900, lineHeight: 1.4 }}>
          なぜ、あなたの会社のイベントは<br />「盛り上がらない」のか。
        </div>
```

- [ ] **Step 2 — SuccessSection（CH02 タイトル）:**  
  `className="pc-h2"` の「マンガで見る、成功例」の `<div` → `<h2>`。

```473:473:index.html
          <div className="pc-h2" style={{ color: '#fff', fontSize: 20, fontWeight: 900, lineHeight: 1.35 }}>マンガで見る、成功例</div>
```

- [ ] **Step 3 — StoryCard（カードタイトル）:**  
  `STORY {story.id}` の直下にある、`fontSize: compact ? 12 : 14` のタイトル行の `<div` → `<h3>`。閉じタグ `</h3>`。

```447:447:index.html
        <div style={{ fontSize: compact ? 12 : 14, fontWeight: 900, lineHeight: 1.35, whiteSpace: 'pre-line', marginBottom: compact ? 4 : 6, color: cs ? '#555' : '#111' }}>{story.cardTitle}</div>
```

- [ ] **Step 4 — KnowhowSection（CH03 タイトル）:**  
  `成功へのノウハウ・3つのポイント` の `<div className="pc-h2"` → `<h2>`。

```514:514:index.html
          <div className="pc-h2" style={{ color: C.black, fontSize: 20, fontWeight: 900, lineHeight: 1.35 }}>成功へのノウハウ・3つのポイント</div>
```

- [ ] **Step 5 — Knowhow 各アイテムタイトル:**  
  `{k.title}` を包む `<span style={{ fontSize: 14, fontWeight: 900, color: C.black }}>` を次に置換する。

```jsx
<h3 style={{ fontSize: 14, fontWeight: 900, color: C.black, display: 'inline', margin: 0 }}>{k.title}</h3>
```

- [ ] **Step 6 — InvestmentSection（CH04 タイトル）:**  
  `「社内イベント」は、...投資だった。` の外枠 `<div style={{ color: '#fff', fontSize: 26, ...` → `<h2 style={{ ...同じ... }}>`。内側の `<span style={{ color: C.yellow }}>` は触らない。

```579:581:index.html
        <div style={{ color: '#fff', fontSize: 26, fontWeight: 900, lineHeight: 1.35, marginBottom: 16 }}>
          「社内イベント」は、<br /><span style={{ color: C.yellow }}>コストじゃなく、</span><br />投資だった。
        </div>
```

- [ ] **Step 7:** DevTools で上記が `h2` / `h3` になっていることを確認。見た目のスクリーンショット差分で変化がないことを確認。

- [ ] **Step 8:** コミット

```bash
git add index.html
git commit -m "feat(seo): semantic h2/h3 for chapter and card titles"
```

---

### Task 5: PC 用 `.pc-whatis-grid` / `.pc-whatis-section` を `@media` に追加

**Files:**
- Modify: `index.html`（`@media (min-width: 860px)` ブロック内、`.pc-hide` の前が目安）

- [ ] **Step 1:** 次を `@media (min-width: 860px) {` 内に追加する。

```css
  .pc-whatis-grid {
    grid-template-columns: 1fr 1fr 1fr !important;
  }
  .pc-whatis-section {
    padding: 56px 40px !important;
  }
```

- [ ] **Step 2:** コミット

```bash
git add index.html
git commit -m "style(pc): CH01.5 what-is grid 3 columns on wide viewport"
```

---

### Task 6: `MangaBubble`・`ITEMS`・`WhatIsEventSection` を追加し `App` に挿入

**Files:**
- Modify: `index.html`（`FailureSection` 終了直後〜`SuccessSection` の前）

- [ ] **Step 1:** `function FailureSection()` の閉じ `}` の直後（現行では `FailureSection` の `}` の次、`const STORIES` の前）、次の順で追加する。
  1. `const WHATIS_ITEMS = [ ... ]`（仕様の `ITEMS` と同一内容。名前は `STORIES` と衝突しないよう `WHATIS_ITEMS` 推奨）
  2. `function MangaBubble({ children, tailSide = 'left' }) { ... }` — `ch01-5-variants.jsx` の 226-244 行相当をそのままコピー（`C` は既存トークンを使用）
  3. `function WhatIsEventSection() { ... }` — `VariantD` の 251-354 行相当をコピーし、次を調整する:
     - 最外 `<section>` に `className="pc-whatis-section"` を付与
     - `style` に **`borderTop` を付けない**（`FailureSection` の `borderBottom: 3px` と二重にしない）
     - 6 項目グリッドの `div` に `className="pc-whatis-grid"` を付与し、`style` の `display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14` は維持（PC で `.pc-whatis-grid` が 3 列に上書き）
     - `ITEMS.map` を `WHATIS_ITEMS.map` に変更

- [ ] **Step 2:** `function App()` 内で、`<FailureSection />` の直後に `<WhatIsEventSection />` を挿入する。

```jsx
      <FailureSection />
      <WhatIsEventSection />
      <SuccessSection onOpen={setOpenStory} />
```

- [ ] **Step 3:** モバイル幅で 2 列、幅 ≥860px で 3 列×2 行になることを確認。

- [ ] **Step 4:** `FailureSection` 直下と CH01.5 直下の境界線が 6px のように見えない（1 本の 3px）ことを確認。

- [ ] **Step 5:** コミット

```bash
git add index.html
git commit -m "feat(content): add CH01.5 WhatIsEventSection (design D)"
```

---

### Task 7: FAQPage の各回答とページ本文の完全一致

**Files:**
- Modify: `index.html`（`FailureSection` 気づき吹き出し、`KnowhowSection`、`InvestmentSection`、`CTASection` または `InvestmentSection` 末尾）

仕様: FAQ の `acceptedAnswer.text` と**一字一句**同じ文がページ上のどこかに存在すること（可視テキスト推奨。非表示のみの詰め込みは避ける）。

- [ ] **Step 1 — Q2「なぜ盛り上がらない」:**  
  `pc-failure-aware` 内の 2 つのテキストブロックを、次の**一続きの文**として画面上に載せる（改行はデザイン維持のため `<br />` 可。文言は次と一致させる）。

  必須文（全文）:
  `問題は予算でも規模でもなく、目的設計がなかったことです。「目的なきイベント」は、お金と時間を消費するだけで、組織には何も残りません。`

  実装例（`style` は既存の親子 div に維持し、子の `fontSize` / `fontWeight` は現状に近い値のままテキストのみ差し替え）:

```jsx
        <div style={{ fontSize: 13, fontWeight: 900, lineHeight: 1.5, color: C.black }}>
          問題は予算でも規模でもなく、目的設計がなかったことです。<br />
          「目的なきイベント」は、お金と時間を消費するだけで、組織には何も残りません。
        </div>
```

  2 段落目にしていた薄色説明は、上記と重複しないよう削除するか、上記に統合する（見た目は近い行間・色で調整。インライン style の**プロパティ追加**は最小限に）。

- [ ] **Step 2 — Q3「成功のポイント」:**  
  `KnowhowSection` の `pc-knowhow` グリッド**直後**（動画ブロックの前）、`padding` / `margin` を既存セクションに合わせた `div` で、次の 1 段落を表示する（`style` は新規ブロックにのみ指定可）。

  必須文（全文）:
  `3点あります。①目的を先に設計する：何を変えたいかから逆算する。②「体験」で関係をつくる：講演ではなく共体験で心理的距離を縮める。③余韻を設計に組み込む：イベント後の行動変容まで見越す。`

```jsx
      <div style={{ padding: '0 14px 16px', maxWidth: 1120, margin: '0 auto' }}>
        <p className="pc-body" style={{ fontSize: 12, lineHeight: 1.85, color: '#444', textWrap: 'pretty' }}>
          3点あります。①目的を先に設計する：何を変えたいかから逆算する。②「体験」で関係をつくる：講演ではなく共体験で心理的距離を縮める。③余韻を設計に組み込む：イベント後の行動変容まで見越す。
        </p>
      </div>
```

- [ ] **Step 3 — Q4「コストか投資か」:**  
  `InvestmentSection` の白文字説明段落（現行 582-586 行付近）の**テキストノード**を、次の全文に差し替える。`style={{ color: 'rgba(255,255,255,0.6)', ... }}` は維持。

  必須文:
  `設計次第で投資になります。楽しいだけ・盛り上がるだけで終わらず、その後の働き方につながるイベント設計が、投資対効果を引き上げます。`

- [ ] **Step 4 — Q5「COMETはどんな会社」:**  
  `CTASection` の `<p className="pc-body" ...>` の直前、または `<p>` 内の先頭に、次の文を**そのまま**含める（CTA 既存文と連結してもよいが、FAQ 文は欠かさず連続で出現させる）。

  必須文:
  `10年・150社以上・300件以上の実績を持つ、社内イベント設計・運営の専門企業。経営方針発表会から懇親会まで、目的別に最適なイベントを設計します。無料相談から対応可能です。`

- [ ] **Step 5 — Q1「社内イベントとは」:**  
  `WhatIsEventSection` の定義用 `<p>` 内に、FAQ 回答全文を**そのまま**含める（仕様の h2 直下短文に加え、AEO 用に同じ段落または直後の段落で全文を載せる）。重複を避けたい場合は、h2 と短いリードの後に `<p>` を 1 つ追加し、FAQ の `text` 全文のみを載せる。

  必須文:
  `社内イベントは、単なるレクリエーションではなく、組織課題を解くための施策です。目的設計・実行・測定を伴う経営アクションであり、目的に応じて経営方針発表会・全社会議・社内表彰式・懇親会・オフサイトミーティング・新入社員歓迎会などの形式が選ばれます。`

- [ ] **Step 6:** ブラウザで Ctrl+F 検索し、上記 5 文がページソース上に完全一致で存在することを確認。

- [ ] **Step 7:** コミット

```bash
git add index.html
git commit -m "feat(aeo): align on-page copy with FAQPage JSON-LD answers"
```

---

### Task 8: 最終検証とドキュメント差分

**Files:**
- Read: `docs/superpowers/specs/2026-05-08-comet-lp-seo-aeo-design.md` §8 チェックリスト

- [ ] **Step 1:** [リッチリザルトテスト](https://search.google.com/test/rich-results) に本番 URL またはスニペットで JSON-LD を投入し、エラーがないことを確認。

- [ ] **Step 2:** [Schema Validator](https://validator.schema.org/) で同様に確認。

- [ ] **Step 3:** 仕様 §8 のチェックリストをすべて手動で照合し、未完了があれば Task 1-7 に戻る。

- [ ] **Step 4:** コミット（ドキュメント変更がなければスキップ可）

```bash
git status
```

---

## Self-review（計画 vs 仕様）

| 仕様セクション | 対応タスク |
|----------------|------------|
| CH01.5 配置・デザイン D・境界線・SVG・6 カード・ITEMS | Task 5, 6 |
| 見出し階層・リセット CSS | Task 3, 4 |
| JSON-LD 3 種 | Task 1 |
| meta / canonical / OGP | Task 2 |
| FAQ と本文一致 | Task 7（仕様の必須要件。CH01.5 追加だけでは Q2-Q5 が未充足のため明示タスク化） |
| 完了条件・検証 | Task 8 |

**Placeholder スキャン:** 計画内の `<確定パス>/` のみデプロイ時置換。それ以外に TBD なし。

---

**Plan complete and saved to `docs/superpowers/plans/2026-05-09-comet-lp-seo-aeo-implementation.md`. Two execution options:**

**1. Subagent-Driven (recommended)** — タスクごとに新しいサブエージェントを起こし、タスク間でレビューする。

**2. Inline Execution** — このセッションで `executing-plans` に沿い、チェックポイント付きで順に実装する。

どちらで進めますか？
