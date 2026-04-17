// Pomodoro Timer - Core Logic

const WORK_SECONDS = 25 * 60;
const BREAK_SECONDS = 5 * 60;

function createInitialState() {
  return {
    mode: 'work',
    status: 'idle',
    remaining: WORK_SECONDS,
    completedCount: 0,
    totalFocusSeconds: 0,
  };
}

function shouldSwitchMode(state) {
  return state.remaining <= 0;
}

function tick(state) {
  if (state.status !== 'running') return { ...state };

  const next = { ...state, remaining: state.remaining - 1 };

  if (shouldSwitchMode(next)) {
    if (next.mode === 'work') {
      return {
        ...next,
        mode: 'break',
        remaining: BREAK_SECONDS,
        status: 'running',
        completedCount: next.completedCount + 1,
        totalFocusSeconds: next.totalFocusSeconds + WORK_SECONDS,
      };
    }
    return {
      ...next,
      mode: 'work',
      remaining: WORK_SECONDS,
      status: 'idle',
    };
  }

  return next;
}

function toggleTimer(state) {
  if (state.status === 'running') {
    return { ...state, status: 'paused' };
  }
  return { ...state, status: 'running' };
}

function resetTimer(state) {
  const duration = state.mode === 'work' ? WORK_SECONDS : BREAK_SECONDS;
  return { ...state, status: 'idle', remaining: duration };
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function calcProgress(state) {
  const total = state.mode === 'work' ? WORK_SECONDS : BREAK_SECONDS;
  return 1 - state.remaining / total;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    WORK_SECONDS,
    BREAK_SECONDS,
    createInitialState,
    tick,
    toggleTimer,
    resetTimer,
    formatTime,
    calcProgress,
    shouldSwitchMode,
  };
}
