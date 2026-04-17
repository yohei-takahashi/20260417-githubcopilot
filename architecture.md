# ポモドーロタイマー Webアプリケーション アーキテクチャ

## 技術スタック

- **バックエンド:** Flask (Python)
- **フロントエンド:** HTML / CSS / JavaScript
- **テスト:** pytest (Python) / Jest (JavaScript)

## ディレクトリ構成

```
1.pomodoro/
├── app.py                     # Flask サーバー (ファクトリパターン)
├── static/
│   ├── css/
│   │   └── style.css          # スタイル定義
│   └── js/
│       ├── timerCore.js       # タイマー純粋ロジック（DOM依存なし）
│       ├── storage.js         # localStorage 抽象化レイヤー
│       └── app.js             # DOM操作・イベントバインド
├── templates/
│   └── index.html             # メインHTML
└── tests/
    ├── test_app.py            # Flask ルートのテスト (pytest)
    ├── test_timer_core.js     # タイマーロジックのテスト (Jest)
    └── test_storage.js        # ストレージのテスト (Jest)
```

## レイヤー設計

| レイヤー | ファイル | 技術 | 責務 |
|---|---|---|---|
| バックエンド | `app.py` | Flask | ルーティング、HTMLテンプレート配信 |
| ビュー | `index.html` | HTML + Jinja2 | UI構造の定義 |
| スタイル | `style.css` | CSS | 円形プログレスバー、ボタン、カードレイアウト |
| 純粋ロジック | `timerCore.js` | JavaScript | タイマーの状態遷移、時間計算、進捗集計 |
| ストレージ | `storage.js` | JavaScript | localStorage への保存・読込の抽象化 |
| UI制御 | `app.js` | JavaScript | DOM更新、イベントリスナー、SVG描画 |

## UIコンポーネント

1. **ヘッダーバー** — タイトル「ポモドーロタイマー」＋ウィンドウ操作アイコン（装飾）
2. **状態ラベル** — 「作業中」「休憩中」の表示切替
3. **円形プログレスバー** — SVG `<circle>` の `stroke-dashoffset` をJSで制御し、残り時間を中央に表示
4. **操作ボタン** — 「開始」「リセット」の2ボタン。開始後は「一時停止」に切替
5. **進捗カード** — 完了ポモドーロ数と累計集中時間を表示

## JavaScript 状態管理

```javascript
state = {
  mode: 'work' | 'break',      // 作業 or 休憩
  status: 'idle' | 'running' | 'paused',
  remaining: number,            // 残り秒数
  completedCount: number,       // 完了ポモドーロ数
  totalFocusSeconds: number     // 累計集中時間（秒）
}
```

- `setInterval` で1秒ごとにカウントダウン
- 0になったら `work → break` / `break → work` を自動切替
- 進捗データは `localStorage` で永続化（日付が変わったらリセット）

## `timerCore.js` の公開関数

| 関数 | 説明 |
|---|---|
| `createInitialState()` | 初期状態の生成 |
| `tick(state)` | 1秒経過時の状態遷移 |
| `toggleTimer(state)` | 開始 / 一時停止の切替 |
| `resetTimer(state)` | タイマーのリセット |
| `formatTime(seconds)` | 秒数を `"25:00"` 形式に変換 |
| `calcProgress(state)` | 0.0〜1.0 のプログレス値を算出 |
| `shouldSwitchMode(state)` | モード切替判定 |

すべて純粋関数として実装し、DOM依存を排除する。

## テスト戦略

### Python (pytest)

- Flask ファクトリパターン (`create_app()`) によりテストクライアントを生成
- ルートのステータスコード・レスポンス内容を検証

### JavaScript (Jest)

- `timerCore.js` の純粋関数を入力→出力でテスト
- `storage.js` はモックオブジェクトに差替えてテスト

### テスタビリティのための設計方針

| 方針 | 理由 |
|---|---|
| JS ロジックとDOM操作の分離 | 純粋関数として Node.js 上でテスト可能に |
| localStorage の抽象化 | テスト時にモック差替え可能に |
| Flask ファクトリパターン | テストクライアント生成が容易に |

## 設計上のポイント

- **タイマーはすべてクライアント側で完結** — Flaskはページ配信のみ。サーバーAPIやDB不要
- **円形プログレスバーはSVGで実装** — CSSの `conic-gradient` より制御しやすく、アニメーションも滑らか
- **レスポンシブ対応** — `max-width` + `margin: auto` でモバイルでも表示可能
