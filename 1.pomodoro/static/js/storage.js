// Pomodoro Timer - Storage

const STORAGE_KEY = 'pomodoroProgress';

function getTodayString() {
  return new Date().toISOString().slice(0, 10);
}

function saveProgress(completedCount, totalFocusSeconds, store) {
  const storage = store || localStorage;
  const data = {
    completedCount: completedCount,
    totalFocusSeconds: totalFocusSeconds,
    date: getTodayString(),
  };
  storage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadProgress(store) {
  const storage = store || localStorage;
  const raw = storage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const data = JSON.parse(raw);
    if (data.date !== getTodayString()) {
      clearProgress(storage);
      return null;
    }
    return {
      completedCount: data.completedCount || 0,
      totalFocusSeconds: data.totalFocusSeconds || 0,
    };
  } catch (e) {
    clearProgress(storage);
    return null;
  }
}

function clearProgress(store) {
  const storage = store || localStorage;
  storage.removeItem(STORAGE_KEY);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    STORAGE_KEY,
    getTodayString,
    saveProgress,
    loadProgress,
    clearProgress,
  };
}
