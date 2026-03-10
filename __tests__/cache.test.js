/**
 * @jest-environment jsdom
 */

import { saveCache, loadCache } from "../src/cache.js";

beforeEach(() => {
  localStorage.clear();
});

describe("saveCache", () => {
  test("stores users to localStorage", () => {
    const users = [{ username: "Alice", score: 100 }];
    saveCache(users);
    expect(localStorage.getItem("cw-leaderboard")).toBe(JSON.stringify(users));
  });

  test("stores valid JSON", () => {
    saveCache([{ username: "Bob" }]);
    expect(() => JSON.parse(localStorage.getItem("cw-leaderboard"))).not.toThrow();
  });
});

describe("loadCache", () => {
  test("returns false when no cache exists", () => {
    expect(loadCache()).toBe(false);
  });

  test("returns cached data when cache exists", () => {
    const users = [{ username: "Alice" }];
    localStorage.setItem("cw-leaderboard", JSON.stringify(users));
    const result = loadCache();
    expect(result).not.toBe(false);
    expect(Array.isArray(result)).toBe(true);
  });

  test("restores data correctly — return value equals original stored data", () => {
    const users = [{ username: "Alice", score: 42 }];
    localStorage.setItem("cw-leaderboard", JSON.stringify(users));
    expect(loadCache()).toEqual(users);
  });

  test("returns false on malformed JSON", () => {
    localStorage.setItem("cw-leaderboard", "{{not valid json}}");
    expect(loadCache()).toBe(false);
  });
});
