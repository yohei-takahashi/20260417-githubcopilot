const {
  WORK_DURATION,
  BREAK_DURATION,
  createInitialState,
  tick,
  toggleTimer,
  resetTimer,
  formatTime,
  calcProgress,
  shouldSwitchMode,
} = require('../static/js/timerCore');

describe('createInitialState', () => {
  test('作業モード・25:00・idle状態の初期stateを返す', () => {
    const state = createInitialState();
    expect(state.mode).toBe('work');
    expect(state.status).toBe('idle');
    expect(state.remaining).toBe(25 * 60);
    expect(state.completedCount).toBe(0);
    expect(state.totalFocusSeconds).toBe(0);
  });
});

describe('tick', () => {
  test('running状態のとき残り時間を1秒減らす', () => {
    const state = { mode: 'work', status: 'running', remaining: 1500, completedCount: 0, totalFocusSeconds: 0 };
    const next = tick(state);
    expect(next.remaining).toBe(1499);
  });

  test('idle状態のとき状態を変更しない', () => {
    const state = { mode: 'work', status: 'idle', remaining: 1500, completedCount: 0, totalFocusSeconds: 0 };
    const next = tick(state);
    expect(next.remaining).toBe(1500);
    expect(next.status).toBe('idle');
  });

  test('paused状態のとき状態を変更しない', () => {
    const state = { mode: 'work', status: 'paused', remaining: 1500, completedCount: 0, totalFocusSeconds: 0 };
    const next = tick(state);
    expect(next.remaining).toBe(1500);
    expect(next.status).toBe('paused');
  });

  test('作業モードで残り1秒のとき休憩モードに切り替わる', () => {
    const state = { mode: 'work', status: 'running', remaining: 1, completedCount: 0, totalFocusSeconds: 0 };
    const next = tick(state);
    expect(next.mode).toBe('break');
    expect(next.remaining).toBe(BREAK_DURATION);
    expect(next.status).toBe('running');
    expect(next.completedCount).toBe(1);
    expect(next.totalFocusSeconds).toBe(WORK_DURATION);
  });

  test('休憩モードで残り1秒のとき作業モードに切り替わる', () => {
    const state = { mode: 'break', status: 'running', remaining: 1, completedCount: 2, totalFocusSeconds: 3000 };
    const next = tick(state);
    expect(next.mode).toBe('work');
    expect(next.remaining).toBe(WORK_DURATION);
    expect(next.status).toBe('running');
    expect(next.completedCount).toBe(2);
    expect(next.totalFocusSeconds).toBe(3000);
  });

  test('元のstateを変更しない（イミュータブル）', () => {
    const state = { mode: 'work', status: 'running', remaining: 1500, completedCount: 0, totalFocusSeconds: 0 };
    const next = tick(state);
    expect(state.remaining).toBe(1500);
    expect(next).not.toBe(state);
  });
});

describe('toggleTimer', () => {
  test('idle状態からrunningに切り替わる', () => {
    const state = { mode: 'work', status: 'idle', remaining: 1500, completedCount: 0, totalFocusSeconds: 0 };
    const next = toggleTimer(state);
    expect(next.status).toBe('running');
  });

  test('running状態からpausedに切り替わる', () => {
    const state = { mode: 'work', status: 'running', remaining: 1200, completedCount: 0, totalFocusSeconds: 0 };
    const next = toggleTimer(state);
    expect(next.status).toBe('paused');
  });

  test('paused状態からrunningに切り替わる', () => {
    const state = { mode: 'work', status: 'paused', remaining: 1200, completedCount: 0, totalFocusSeconds: 0 };
    const next = toggleTimer(state);
    expect(next.status).toBe('running');
  });

  test('元のstateを変更しない（イミュータブル）', () => {
    const state = { mode: 'work', status: 'idle', remaining: 1500, completedCount: 0, totalFocusSeconds: 0 };
    const next = toggleTimer(state);
    expect(state.status).toBe('idle');
    expect(next).not.toBe(state);
  });
});

describe('resetTimer', () => {
  test('作業モードのとき25:00にリセットされる', () => {
    const state = { mode: 'work', status: 'running', remaining: 600, completedCount: 2, totalFocusSeconds: 3000 };
    const next = resetTimer(state);
    expect(next.status).toBe('idle');
    expect(next.remaining).toBe(WORK_DURATION);
    expect(next.completedCount).toBe(2);
    expect(next.totalFocusSeconds).toBe(3000);
  });

  test('休憩モードのとき5:00にリセットされる', () => {
    const state = { mode: 'break', status: 'running', remaining: 100, completedCount: 2, totalFocusSeconds: 3000 };
    const next = resetTimer(state);
    expect(next.status).toBe('idle');
    expect(next.remaining).toBe(BREAK_DURATION);
  });

  test('元のstateを変更しない（イミュータブル）', () => {
    const state = { mode: 'work', status: 'running', remaining: 600, completedCount: 0, totalFocusSeconds: 0 };
    const next = resetTimer(state);
    expect(state.status).toBe('running');
    expect(next).not.toBe(state);
  });
});

describe('formatTime', () => {
  test('25:00', () => {
    expect(formatTime(1500)).toBe('25:00');
  });

  test('00:00', () => {
    expect(formatTime(0)).toBe('00:00');
  });

  test('05:00', () => {
    expect(formatTime(300)).toBe('05:00');
  });

  test('01:09', () => {
    expect(formatTime(69)).toBe('01:09');
  });

  test('00:01', () => {
    expect(formatTime(1)).toBe('00:01');
  });
});

describe('calcProgress', () => {
  test('開始直後は0.0', () => {
    const state = { mode: 'work', remaining: WORK_DURATION };
    expect(calcProgress(state)).toBeCloseTo(0.0);
  });

  test('作業モード半分経過で0.5', () => {
    const state = { mode: 'work', remaining: WORK_DURATION / 2 };
    expect(calcProgress(state)).toBeCloseTo(0.5);
  });

  test('作業モード完了直前で約1.0', () => {
    const state = { mode: 'work', remaining: 0 };
    expect(calcProgress(state)).toBeCloseTo(1.0);
  });

  test('休憩モードで正しく計算される', () => {
    const state = { mode: 'break', remaining: BREAK_DURATION / 2 };
    expect(calcProgress(state)).toBeCloseTo(0.5);
  });
});

describe('shouldSwitchMode', () => {
  test('残り時間が0のときtrueを返す', () => {
    const state = { remaining: 0 };
    expect(shouldSwitchMode(state)).toBe(true);
  });

  test('残り時間が負のときtrueを返す', () => {
    const state = { remaining: -1 };
    expect(shouldSwitchMode(state)).toBe(true);
  });

  test('残り時間があるときfalseを返す', () => {
    const state = { remaining: 1500 };
    expect(shouldSwitchMode(state)).toBe(false);
  });

  test('残り時間が1秒のときfalseを返す', () => {
    const state = { remaining: 1 };
    expect(shouldSwitchMode(state)).toBe(false);
  });
});
