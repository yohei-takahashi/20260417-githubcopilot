// Pomodoro Timer - App (DOM)

(function () {
  'use strict';

  // --- DOM要素の参照 ---
  var statusLabel = document.getElementById('status-label');
  var timeDisplay = document.getElementById('time-display');
  var progressRing = document.getElementById('progress-ring');
  var toggleBtn = document.getElementById('toggle-btn');
  var resetBtn = document.getElementById('reset-btn');
  var completedCountEl = document.getElementById('completed-count');
  var totalFocusEl = document.getElementById('total-focus');

  // SVG円周長 (2 * π * r = 2 * π * 90 ≈ 565.48)
  var CIRCUMFERENCE = 2 * Math.PI * 90;

  // --- 状態管理 ---
  var state = createInitialState();
  var intervalId = null;

  // --- D-2: 残り時間のDOM更新 ---
  function updateTimeDisplay() {
    timeDisplay.textContent = formatTime(state.remaining);
  }

  // --- D-3: プログレスバー更新 ---
  function updateProgressRing() {
    var progress = calcProgress(state);
    var offset = CIRCUMFERENCE * (1 - progress);
    progressRing.setAttribute('stroke-dashoffset', offset);
  }

  // --- D-4: 状態ラベル更新 ---
  function updateStatusLabel() {
    statusLabel.textContent = state.mode === 'work' ? '作業中' : '休憩中';
  }

  // --- D-5: ボタンラベル切替 ---
  function updateToggleButton() {
    if (state.status === 'running') {
      toggleBtn.textContent = '一時停止';
    } else {
      toggleBtn.textContent = '開始';
    }
  }

  // --- D-6: 進捗カード更新 ---
  function updateProgressCards() {
    completedCountEl.textContent = state.completedCount;
    totalFocusEl.textContent = Math.floor(state.totalFocusSeconds / 60) + '分';
  }

  // 全DOM要素を一括更新
  function render() {
    updateTimeDisplay();
    updateProgressRing();
    updateStatusLabel();
    updateToggleButton();
    updateProgressCards();
  }

  // --- D-1: タイマー駆動 ---
  function startInterval() {
    if (intervalId !== null) return;
    intervalId = setInterval(function () {
      state = tick(state);
      render();
    }, 1000);
  }

  function stopInterval() {
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  // --- D-7: イベントリスナー登録 ---
  toggleBtn.addEventListener('click', function () {
    state = toggleTimer(state);
    if (state.status === 'running') {
      startInterval();
    } else {
      stopInterval();
    }
    render();
  });

  resetBtn.addEventListener('click', function () {
    stopInterval();
    state = resetTimer(state);
    render();
  });

  // 初期描画
  render();
})();
