// Pomodoro Timer - App (DOM)

document.addEventListener('DOMContentLoaded', function () {
  var state = createInitialState();

  // Load saved progress from storage
  var saved = loadProgress();
  if (saved) {
    state.completedCount = saved.completedCount;
    state.totalFocusSeconds = saved.totalFocusSeconds;
  }

  var intervalId = null;

  var timerDisplay = document.getElementById('timer-display');
  var modeLabel = document.getElementById('mode-label');
  var startBtn = document.getElementById('start-btn');
  var resetBtn = document.getElementById('reset-btn');
  var completedEl = document.getElementById('completed-count');
  var focusTimeEl = document.getElementById('focus-time');
  var progressCircle = document.getElementById('progress-circle');

  var circumference = 2 * Math.PI * 90;
  if (progressCircle) {
    progressCircle.style.strokeDasharray = circumference;
  }

  function render() {
    if (timerDisplay) timerDisplay.textContent = formatTime(state.remaining);
    if (modeLabel) modeLabel.textContent = state.mode === 'work' ? '作業中' : '休憩中';
    if (startBtn) {
      startBtn.textContent = state.status === 'running' ? '一時停止' : '開始';
    }
    if (completedEl) completedEl.textContent = state.completedCount;
    if (focusTimeEl) {
      var mins = Math.floor(state.totalFocusSeconds / 60);
      focusTimeEl.textContent = mins + '分';
    }
    if (progressCircle) {
      var progress = calcProgress(state);
      var offset = circumference * (1 - progress);
      progressCircle.style.strokeDashoffset = offset;
    }
  }

  function onTick() {
    var prevCount = state.completedCount;
    state = tick(state);
    if (state.completedCount > prevCount) {
      saveProgress(state.completedCount, state.totalFocusSeconds);
    }
    if (state.status === 'idle' && intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
    render();
  }

  if (startBtn) {
    startBtn.addEventListener('click', function () {
      state = toggleTimer(state);
      if (state.status === 'running' && intervalId === null) {
        intervalId = setInterval(onTick, 1000);
      } else if (state.status !== 'running' && intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
      }
      render();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      state = resetTimer(state);
      if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
      }
      render();
    });
  }

  render();
});
