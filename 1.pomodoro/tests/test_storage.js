const {
  STORAGE_KEY,
  getTodayString,
  saveProgress,
  loadProgress,
  clearProgress,
} = require('../static/js/storage');

function createMockStorage() {
  const store = {};
  return {
    getItem: jest.fn((key) => (key in store ? store[key] : null)),
    setItem: jest.fn((key, value) => {
      store[key] = String(value);
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    _store: store,
  };
}

describe('storage.js', () => {
  describe('saveProgress', () => {
    test('completedCount と totalFocusSeconds を localStorage に保存する', () => {
      const mock = createMockStorage();
      saveProgress(3, 4500, mock);

      expect(mock.setItem).toHaveBeenCalledTimes(1);
      const saved = JSON.parse(mock._store[STORAGE_KEY]);
      expect(saved.completedCount).toBe(3);
      expect(saved.totalFocusSeconds).toBe(4500);
      expect(saved.date).toBe(getTodayString());
    });
  });

  describe('loadProgress', () => {
    test('保存データが無い場合 null を返す', () => {
      const mock = createMockStorage();
      const result = loadProgress(mock);
      expect(result).toBeNull();
    });

    test('今日の保存データがあれば復元する', () => {
      const mock = createMockStorage();
      const data = {
        completedCount: 5,
        totalFocusSeconds: 7500,
        date: getTodayString(),
      };
      mock._store[STORAGE_KEY] = JSON.stringify(data);

      const result = loadProgress(mock);
      expect(result).toEqual({
        completedCount: 5,
        totalFocusSeconds: 7500,
      });
    });

    test('日付が異なる場合 null を返しデータをクリアする', () => {
      const mock = createMockStorage();
      const data = {
        completedCount: 2,
        totalFocusSeconds: 3000,
        date: '2000-01-01',
      };
      mock._store[STORAGE_KEY] = JSON.stringify(data);

      const result = loadProgress(mock);
      expect(result).toBeNull();
      expect(mock.removeItem).toHaveBeenCalledWith(STORAGE_KEY);
    });

    test('不正な JSON の場合 null を返しクリアする', () => {
      const mock = createMockStorage();
      mock._store[STORAGE_KEY] = 'invalid-json';

      const result = loadProgress(mock);
      expect(result).toBeNull();
      expect(mock.removeItem).toHaveBeenCalledWith(STORAGE_KEY);
    });
  });

  describe('clearProgress', () => {
    test('localStorage からデータを削除する', () => {
      const mock = createMockStorage();
      mock._store[STORAGE_KEY] = JSON.stringify({ completedCount: 1 });

      clearProgress(mock);
      expect(mock.removeItem).toHaveBeenCalledWith(STORAGE_KEY);
    });
  });

  describe('getTodayString', () => {
    test('YYYY-MM-DD 形式の文字列を返す', () => {
      const today = getTodayString();
      expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });
});
