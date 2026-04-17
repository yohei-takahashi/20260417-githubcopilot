# ポモドーロタイマー 段階的実装計画

## Phase 1: プロジェクト基盤（B-1, B-2, B-3）

**ゴール:** Flaskサーバーが起動し、空のHTMLページが表示される

| 対象 | 作業内容 |
|---|---|
| `app.py` | ファクトリパターンに書き換え |
| `templates/index.html` | 最小限のHTMLスケルトン作成 |
| `static/` | ディレクトリ構成の作成（css/, js/） |
| 不要ファイル | `templates/app.py` の削除 |

**確認方法:** `python app.py` → ブラウザで `localhost:5000` にアクセスしページが表示される

---

## Phase 2: 静的UI（U-1〜U-9）

**ゴール:** モック画像どおりの見た目が完成（動作なし）

| 対象 | 作業内容 |
|---|---|
| `index.html` | ヘッダー、状態ラベル、SVG円形プログレスバー、ボタン、進捗カードのHTML構造 |
| `style.css` | 紫グラデーション背景、カードレイアウト、ボタンスタイル、SVGサイズ・色、レスポンシブ対応 |

**確認方法:** ブラウザでモック画像と見比べ、レイアウト・色・フォントが一致している

---

## Phase 3: タイマーコアロジック + テスト（L-1〜L-9, T-2）

**ゴール:** 純粋関数がすべて実装され、ユニットテストが通る

| 対象 | 作業内容 |
|---|---|
| `timerCore.js` | `createInitialState`, `tick`, `toggleTimer`, `resetTimer`, `formatTime`, `calcProgress`, `shouldSwitchMode` の実装 |
| `package.json` | Jest の設定 |
| `tests/test_timer_core.js` | 全関数のテストケース作成・実行 |

**確認方法:** `npx jest test_timer_core.js` → 全テスト PASS

---

## Phase 4: DOM連携でタイマー動作（D-1〜D-7）

**ゴール:** ブラウザ上でタイマーが動作する

| 対象 | 作業内容 |
|---|---|
| `app.js` | `setInterval` によるタイマー駆動、DOM更新（残り時間、プログレスバー、状態ラベル、ボタンラベル）、イベントリスナー登録 |
| `index.html` | JS ファイルの読み込み追加 |

**確認方法:** ブラウザで「開始」→ カウントダウン動作 →「一時停止」→「リセット」→ 作業完了後に休憩モードへ自動切替

---

## Phase 5: データ永続化 + テスト（S-1〜S-3, T-3）

**ゴール:** ページリロードしても進捗が保持され、日付変更でリセットされる

| 対象 | 作業内容 |
|---|---|
| `storage.js` | `save`, `load`, `clear` + 日付チェックの実装 |
| `app.js` | `storage.js` の組み込み（初期化時に読込、完了時に保存） |
| `tests/test_storage.js` | モック `localStorage` でのテスト |

**確認方法:** ポモドーロ完了 → リロード → 進捗カードの値が保持されている

---

## Phase 6: Flask テスト + 最終確認（T-1）

**ゴール:** 全テストが通り、アプリが完成

| 対象 | 作業内容 |
|---|---|
| `tests/test_app.py` | Flask テストクライアントで `GET /` を検証 |
| `requirements.txt` | Flask, pytest の依存定義 |
| 全体 | 通しテスト・最終動作確認 |

**確認方法:** `pytest` + `npx jest` → 全テスト PASS、ブラウザで一連のフローが動作する

---

## フェーズ間の依存関係

```
Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5 → Phase 6
(基盤)    (見た目)   (ロジック)  (動作)    (永続化)   (テスト完)
```

Phase 3（ロジック）は Phase 2（見た目）と並行作業も可能だが、順番に進めたほうが確認がしやすい。
