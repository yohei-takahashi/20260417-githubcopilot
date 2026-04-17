// Pomodoro Timer - Core Logic

var WORK_SECONDS = 25 * 60;
var BREAK_SECONDS = 5 * 60;

function createInitialState() {
  return {
    mode: 'work',
    status: 'idle',
    remaining: WORK_SECONDS,
    completedCount: 0,
    totalFocusSeconds: 0
  };
}

function shouldSwitchMode(state) {
  return state.remaining <= 0;
}

function tick(state) {
  if (state.status !== 'running') {
    return state;
  }

  var next = Object.assign({}, state, { remaining: state.remaining - 1 });

  if (shouldSwitchMode(next)) {
    if (next.mode === 'work') {
      next.completedCount = next.completedCount + 1;
      next.totalFocusSeconds = next.totalFocusSeconds + WORK_SECONDS;
      next.mode = 'break';
      next.remaining = BREAK_SECONDS;
    } else {
      next.mode = 'work';
      next.remaining = WORK_SECONDS;
    }
    next.status = 'running';
  }

  return next;
}

function toggleTimer(state) {
  var nextStatus;
  if (state.status === 'idle' || state.status === 'paused') {
    nextStatus = 'running';
  } else {
    nextStatus = 'paused';
  }
  return Object.assign({}, state, { status: nextStatus });
}

function resetTimer(state) {
  var duration = state.mode === 'work' ? WORK_SECONDS : BREAK_SECONDS;
  return Object.assign({}, state, { status: 'idle', remaining: duration });
}

function formatTime(seconds) {
  var m = Math.floor(seconds / 60);
  var s = seconds % 60;
  return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
}

function calcProgress(state) {
  var total = state.mode === 'work' ? WORK_SECONDS : BREAK_SECONDS;
  if (total === 0) return 0;
  return 1 - state.remaining / total;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    WORK_SECONDS: WORK_SECONDS,
    BREAK_SECONDS: BREAK_SECONDS,
    createInitialState: createInitialState,
    tick: tick,
    toggleTimer: toggleTimer,
    resetTimer: resetTimer,
    formatTime: formatTime,
    calcProgress: calcProgress,
    shouldSwitchMode: shouldSwitchMode
  };
}
