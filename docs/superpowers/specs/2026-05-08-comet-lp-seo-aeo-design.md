# COMET LP — SEO / AEO 対策 設計書 v2

**対象:** `index.html`（シングルページ LP。React/Babel インライン構成）  
**日付:** 2026-05-08（v2 更新: 2026-05-09）  
**優先方針:** 通常検索（SEO）と AI 回答・引用（AEO / LLMO）のハイブリッド。

---

## 0. 絶対ルール（実装者向け）

- **見た目は一切変更しない。** タグ置換・CSS リセット追加・`<head>` への追記のみ。
- 既存のインラインスタイル（`style={{...}}`）は**絶対に削除・改変しない**。
- 既存の `className`（`pc-h1` `pc-h2` 等のメディアクエリ用クラス）は維持。
- React コンポーネントの構造変更は最小限。
- `index.html` を直接編集。バージョン分けはしない。

---

## 1. 背景・目的

- LP が検索エンジン・対話型検索の両方から「意図に沿って発見・要約・引用」されやすくする。
- 「社内イベント」を単なるレクリエーションではなく、**経営・組織課題を解く施策群**として再定義し、COMET への導線と両立する。

---

## 2. スコープ

### 今回含む（4点）

1. **CH01.5「社内イベントとは」新セクションの追加**（デザイン案 D 確定）
2. **見出し階層リファクタ**（h1/h2/h3 化）
3. **構造化データ（JSON-LD 3種）** の追加
4. **meta description / canonical / OGP** の追加

### 今回含まない（スコープ外）

- 数値実績（10年/150社+/300件+）への注釈追加
- FAQ の可視 UI（アコーディオン等）← 置かない方針
- 画像 lazy loading / width-height 属性（必要なら別タスク）
- GA4 イベント計測（別タスク）
- 多言語対応
- 6 項目から下層記事へのリンク張り（記事完成後の別タスク）

---

## 3. アプローチ選定

| 案 | 内容 | トレードオフ |
|----|------|-------------|
| A SEO 最優先 | title/description/速度/h 構造 | AI 引用向けの情報密度が弱めになりやすい |
| B AI 検索最優先 | FAQ・構造化データ・一次情報 | 通常 SEO の即効性がやや落ちる |
| **C ハイブリッド（採用）** | 基本 SEO と引用しやすい情報設計を両立 | 実装・文言調整の工数は中程度 |

---

## 4. CH01.5「社内イベントとは」セクション（採用案 D）

### 4.1 配置

- **挿入位置:** `FailureSection`（CHAPTER 01）の直後、`SuccessSection`（CHAPTER 02）の直前。
- App コンポーネント内の JSX:

```jsx
<FailureSection />
<WhatIsEventSection />   {/* ← 新規追加 */}
<SuccessSection onOpen={setOpenStory} />
```

### 4.2 セクションの役割

「失敗4コマ」で課題提起した直後、読者の心に浮かぶ「**そもそも社内イベントって？**」という疑問に答え、続く成功ストーリーへ橋渡しする**チャプター間ブリッジ**。

SEO/AEO 上の核セクションとして以下を担う:
- 「社内イベント」キーワードに対する **明確な定義**（h2 + 本文）を提示
- 6 つの代表的形式を**目的タグ付き**で網羅
- FAQPage JSON-LD の "社内イベントとは何ですか？" の回答と**本文を一致**させる

### 4.3 デザイン仕様（デザイン案 D）

| 要素 | 仕様 |
|------|------|
| 背景 | オフホワイト `#fafaf8` + 斜線ハッチング `repeating-linear-gradient(45deg, transparent 12px, rgba(0,0,0,0.018) 12px, rgba(0,0,0,0.018) 13px)` |
| 上下境界 | `borderBottom: 3px solid #111`（上境界は付けない → §4.5 注意点3 参照）|
| Eyebrow | `color: #F23838`、`fontSize: 10`、`fontWeight: 700`、`letterSpacing: 0.1em`、テキスト「CHAPTER 01.5」|
| メイン吹き出し | SVG 単一 `<path>` で本体+しっぽを一筆描き（`MangaBubble` コンポーネント）。影は親に `filter: drop-shadow(3px 3px 0 #111)`。CSS 三角は NG |
| キャラ | 半円グレーシルエット（プレースホルダ）。本番は実イラスト差替 |
| 定義 h2 | `fontSize: 18, fontWeight: 900`。「組織課題を解く"施策"」に黄色マーカー `linear-gradient(transparent 60%, #FFE133 60%)` |
| 定義本文 | 「単なるレクではなく、**目的設計→実行→測定**を伴う経営アクション。目的に応じて、最適な"形式"を選びます。」（文言固定） |
| 6 項目カード | マンガパネル風（§4.4 参照）。**吹き出しは使わない** |
| 締めの一文 | 「▼ どの形式でも、**設計次第**で結果は変わる。」中央寄せ。「設計次第」に黄色マーカー |

### 4.4 6項目カード仕様

**吹き出しを使わない理由:** ページ内に大きな問いかけ吹き出し＋6個の小吹き出しを並べると、主吹き出しのインパクトが薄れる。吹き出しは「読者の問い」のみに絞り、カードは CHAPTER 01 の失敗4コマと同じマンガパネル語彙で組む。

| パーツ | 仕様 |
|--------|------|
| 外形 | `border: 2.5px solid #111`、`borderRadius: 4`、`boxShadow: 3px 3px 0 #111` |
| 傾き | 各カードに `transform: rotate(Xdeg)` で微傾き。値: `[-1.5, 1.0, -0.6, 1.4, -1.1, 0.7]` |
| 背景 | `#fff` + 内側斜線スクリーントーン `repeating-linear-gradient(45deg, transparent 6px, rgba(0,0,0,0.04) 6px, rgba(0,0,0,0.04) 7px)` |
| パネル番号バッジ | 左上に `background: item.color`、白文字、`Bangers` フォント `fontSize: 16`。右下に `2px solid #111` |
| 集中線（グロー） | バッジ周囲に `radial-gradient(circle, ${item.color}22 0%, transparent 70%)` |
| イベント名 | `fontSize: 13, fontWeight: 900`、黒 |
| 目的タグ | `borderRadius: 10`、白背景、`1.5px solid #111`、`boxShadow: 1.5px 1.5px 0 #111`、文字色は `item.color` |

**項目データ（固定）:**

```js
const ITEMS = [
  { name: '経営方針発表会',   purpose: '方針浸透',         color: '#2AA5DB' },
  { name: '全社会議',          purpose: '全社連携',         color: '#2AA5DB' },
  { name: '社内表彰式',        purpose: '称賛文化',         color: '#F23838' },
  { name: '懇親会',             purpose: '部署横断',         color: '#02BF61' },
  { name: 'オフサイト',        purpose: '戦略整理',         color: '#2AA5DB' },
  { name: '新入社員歓迎会',   purpose: 'オンボーディング', color: '#02BF61' }
];
```

### 4.5 実装上の注意点

1. **吹き出しは SVG で描画。** `ch01-5-variants.jsx` の `MangaBubble` コンポーネントをそのまま転記。`index.html` の `C` トークン・インラインスタイル方針に合わせること。
2. **PC レイアウト対応。** `@media (min-width: 860px)` に以下を追加（モバイル2列→PC3列）:
   ```css
   .pc-whatis-grid   { grid-template-columns: 1fr 1fr 1fr !important; }
   .pc-whatis-section { padding: 56px 40px !important; }
   ```
3. **境界線の重複回避。** `FailureSection` 末尾にすでに `borderBottom: 3px solid #111` がある。新セクションは `borderTop` を付けず、`borderBottom: 3px solid #111` のみ設定。
4. **黄色マーカーは 1 セクション内 2 箇所まで。** h2 の「組織課題を解く"施策"」と締めの「設計次第」のみ。
5. **`<h2>` タグで出力する。** §5 の見出しリセット CSS が `<head>` にあることが前提。
6. **本文文言は JSON-LD と完全一致させる。** 「単なるレクではなく」「目的設計→実行→測定」「経営方針発表会・全社会議・社内表彰式・懇親会・オフサイトミーティング・新入社員歓迎会」のキーワードは変更禁止。
7. **将来のリンク化に備える。** カード最外要素を後から `<a href>` にラップできる構造にしておく（今回リンクなし）。

### 4.6 実装ソース

`ch01-5-variants.jsx` の `VariantD` が採用デザイン。`MangaBubble` コンポーネントも同ファイル参照。インラインスタイル・`C` トークン方針に合わせて転記すること。

---

## 5. 見出し階層リファクタ（h1/h2/h3）

### 5.1 目的

現状は `h1` のみで全チャプター見出しが `<div>`。SEO/AEO クローラがページ構造を正しく解釈できるよう意味的見出し階層を整える。

### 5.2 目標構造

```
h1  社内イベントは、「設計」で変わる。               （Hero）
h2  なぜ、あなたの会社のイベントは盛り上がらないのか。（CH01 / FailureSection）
h2  社内イベントは、組織課題を解く"施策"です。        （CH01.5 / WhatIsEventSection）
h2  マンガで見る、成功例。                           （CH02 / SuccessSection）
  h3  STORY 01〜03 のタイトル                        （StoryCard）
h2  成功へのノウハウ・3つのポイント                  （CH03 / KnowhowSection）
  h3  各ノウハウのタイトル                           （KNOWHOW item）
h2  社内イベントは、コストじゃなく、投資だった。      （CH04 / InvestmentSection）
```

### 5.3 置換箇所（6箇所＋CH01.5）

| 箇所 | 現行タグ | 変更後 | 備考 |
|------|---------|--------|------|
| (a) FailureSection タイトル | `<div className="pc-fh-title" ...>` | `<h2>` | className・style はそのまま |
| (b) SuccessSection タイトル | `<div className="pc-h2" ...>マンガで見る、成功例</div>` | `<h2>` | 同上 |
| (c) StoryCard タイトル | `<div style={{ fontSize: compact ? 12 : 14, fontWeight: 900, ... }}>` | `<h3>` | 同上 |
| (d) KnowhowSection タイトル | `<div className="pc-h2" ...>成功へのノウハウ…</div>` | `<h2>` | 同上 |
| (e) Knowhow 各アイテムタイトル | `<span style={{ fontSize: 14, fontWeight: 900, ... }}>` | `<h3>` | `display: 'inline', margin: 0` を style に追加 |
| (f) InvestmentSection タイトル | `<div style={{ color: '#fff', fontSize: 26, fontWeight: 900, ... }}>` | `<h2>` | 同上 |
| (g) WhatIsEventSection（新規） | — | `<h2>` | CH01.5 の定義見出し |

### 5.4 CSS リセット（`<style>` 先頭に追加）

```css
h1, h2, h3, h4 {
  all: unset;
  display: block;
}
h3 { display: inherit; }   /* span 由来の h3 用 */
```

これがないとブラウザデフォルトの margin/font-size が乗って見た目が崩れる。

### 5.5 検証

- DevTools で各セクションのタグが `h1/h2/h3` になっていること。
- スクリーンショットを差分比較して**見た目が変わっていないこと**。

---

## 6. 構造化データ（JSON-LD）

### 6.1 配置

`<head>` 内、既存の `<style>` ブロックの直前に 3 スクリプトを追記。

### 6.2 Organization

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "COMET",
  "url": "https://comet-event.co.jp/",
  "logo": "https://comet-event.co.jp/uploads/logo_02.png",
  "description": "社内イベントを"組織課題を解く施策"として設計・運営する企業。",
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "sales",
    "url": "https://comet-event.co.jp/contact/"
  }
}
</script>
```

> `logo` / `url` は本番ドメイン確定後に置換。問い合わせメールアドレス等の公開可否はビジネス側に確認。

### 6.3 WebPage

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

> `url`・`dateModified` はデプロイ時に確定値で置換。本文更新のたびに `dateModified` を更新すること（運用ルール）。

### 6.4 FAQPage

**重要: 本文中の見出し・要約文と完全一致させる。別の言い回しに書き換えない。**

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

> 各回答に対応する本文（CH01.5 定義・CH01 末尾・CH03 ノウハウ・CH04 本文）が必ず存在していること。乖離があるとペナルティリスク。

### 6.5 検証

- [Google リッチリザルトテスト](https://search.google.com/test/rich-results) でエラーゼロを確認。
- [Schema Markup Validator](https://validator.schema.org/) も併用。

---

## 7. meta description / canonical / OGP

### 7.1 `<head>` 差し替え内容

現状の `<title>` を以下に置換・追記:

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

### 7.2 文字数

- `description`: 約 120 文字（全角換算）。日本語 SERP で切られにくい長さ。
- `og:description`: 100 文字以内（FB/X どちらでも切れにくい）。

### 7.3 OGP 画像

- **未作成。別途デザイナーに依頼。** 1200×630px、`uploads/og-image.png` として配置する前提。
- 暫定で既存ロゴ `uploads/logo_02.png` を流用可だが、**本番までに専用画像を準備すること。**

---

## 8. 完了条件チェックリスト

- [ ] CH01.5「社内イベントとは」セクションを `FailureSection` と `SuccessSection` の間に追加
- [ ] メイン吹き出しが SVG で一筆描き（しっぽが途切れていない）
- [ ] 6 項目カードがマンガパネル風（番号バッジ＋スクリーントーン＋集中線＋目的タグ）
- [ ] PC レイアウト（≥860px）で 6 項目が 3 列表示になる
- [ ] 上下境界線が 2 重になっていない
- [ ] h1/h2/h3 への置換が §5.3 の 6 箇所＋CH01.5 の h2 すべて完了
- [ ] `<style>` 先頭に見出しリセット CSS を追加
- [ ] 見た目が変わっていない（差分スクショで確認 ／ CH01.5 は新規なので除外）
- [ ] `<head>` に Organization / WebPage / FAQPage の 3 種 JSON-LD を追加
- [ ] `<head>` に description / canonical / OGP / Twitter Card を追加
- [ ] リッチリザルトテストでエラーゼロ
- [ ] 本文（特に CH01.5）と FAQPage JSON-LD の文言が乖離していないことを目視確認
- [ ] 本番 URL・OGP 画像 URL は確定値を入れる（暫定値で残さない）

---

## 9. 運用・検証（公開後）

- **最初の 30 日:** 検索コンソールの表示・クリックとオンページ行動を確認し、`title`・CH01.5 導入文を 2 週間単位で微調整。
- **FAQ:** 月 1 回、実問い合わせや検索クエリに合わせて更新。`dateModified` も更新する。
- **将来:** 「社内表彰式」「全社会議」等の目的別下層記事を増やし、LP から内部リンクで専門性を補強。

---

## 10. 成功指標（KPI）

- 主要クエリの**表示回数・CTR** の推移。
- **CTA クリック率・問い合わせ率**。
- （取得可能なら）対話型検索での**ブランド・サービス言及**の定性確認。

---

## 11. リスク・禁止事項

- キーワード詰め込み（スタッフィング）、根拠のない数値・過剰な断定。
- FAQ 本文と FAQPage JSON-LD の文言の乖離。
- 境界線の 2 重表示（`borderTop` + 前セクション `borderBottom` の重複）。

---

## 12. 実装フェーズへの引き継ぎ

本書承認後、`writing-plans` スキルに従い、`docs/superpowers/plans/YYYY-MM-DD-comet-lp-seo-aeo.md` にタスク分解された実装計画を作成する。
