// Pomodoro Timer - Core Logic

const WORK_DURATION = 25 * 60;
const BREAK_DURATION = 5 * 60;

function createInitialState() {
  return {
    mode: 'work',
    status: 'idle',
    remaining: WORK_DURATION,
    completedCount: 0,
    totalFocusSeconds: 0,
  };
}

function shouldSwitchMode(state) {
  return state.remaining <= 0;
}

function tick(state) {
  if (state.status !== 'running') {
    return { ...state };
  }

  const newRemaining = state.remaining - 1;

  if (newRemaining <= 0) {
    const isWork = state.mode === 'work';
    return {
      ...state,
      mode: isWork ? 'break' : 'work',
      remaining: isWork ? BREAK_DURATION : WORK_DURATION,
      status: 'running',
      completedCount: isWork ? state.completedCount + 1 : state.completedCount,
      totalFocusSeconds: isWork ? state.totalFocusSeconds + WORK_DURATION : state.totalFocusSeconds,
    };
  }

  return {
    ...state,
    remaining: newRemaining,
  };
}

function toggleTimer(state) {
  if (state.status === 'running') {
    return { ...state, status: 'paused' };
  }
  return { ...state, status: 'running' };
}

function resetTimer(state) {
  const duration = state.mode === 'work' ? WORK_DURATION : BREAK_DURATION;
  return {
    ...state,
    status: 'idle',
    remaining: duration,
  };
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
}

function calcProgress(state) {
  const total = state.mode === 'work' ? WORK_DURATION : BREAK_DURATION;
  return 1 - state.remaining / total;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    WORK_DURATION,
    BREAK_DURATION,
    createInitialState,
    tick,
    toggleTimer,
    resetTimer,
    formatTime,
    calcProgress,
    shouldSwitchMode,
  };
}
