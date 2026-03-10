import { selectUserLanguages, getUserLanguages } from "../src/language.js";

// Helper to build a minimal user object
function makeUser({
  id = "abc",
  username = "User",
  clan,
  languages = {},
  overallScore = 100,
  overallName = "1 kyu",
  leaderboardPosition,
} = {}) {
  return {
    id,
    username,
    clan,
    ranks: {
      overall: { score: overallScore, name: overallName },
      languages,
    },
    leaderboardPosition,
  };
}

// ==================== getUserLanguages ====================

describe("getUserLanguages", () => {
  test("returns ['overall'] for users with no languages", () => {
    const users = [makeUser({ languages: {} })];
    expect(getUserLanguages(users)).toEqual(["overall"]);
  });

  test("returns 'overall' as first element", () => {
    const users = [makeUser({ languages: { javascript: { score: 10 } } })];
    expect(getUserLanguages(users)[0]).toBe("overall");
  });

  test("extracts languages from a single user", () => {
    const users = [makeUser({ languages: { javascript: {}, python: {} } })];
    const result = getUserLanguages(users);
    expect(result).toContain("javascript");
    expect(result).toContain("python");
    expect(result[0]).toBe("overall");
  });

  test("merges languages across multiple users", () => {
    const users = [
      makeUser({ languages: { javascript: {} } }),
      makeUser({ languages: { python: {} } }),
    ];
    const result = getUserLanguages(users);
    expect(result).toContain("javascript");
    expect(result).toContain("python");
  });

  test("deduplicates shared languages", () => {
    const users = [
      makeUser({ languages: { javascript: {} } }),
      makeUser({ languages: { javascript: {} } }),
    ];
    const result = getUserLanguages(users);
    const jsCount = result.filter((l) => l === "javascript").length;
    expect(jsCount).toBe(1);
  });

  test("handles empty users array", () => {
    expect(getUserLanguages([])).toEqual(["overall"]);
  });
});

// ==================== getLeaderboard ====================

describe("getLeaderboard", () => {
  test("sorts by overall score descending", () => {
    const users = [
      makeUser({ username: "A", overallScore: 10 }),
      makeUser({ username: "B", overallScore: 20 }),
    ];
    const result = selectUserLanguages(users, "overall");
    expect(result[0].username).toBe("B");
  });

  test("returns correct object shape", () => {
    const users = [
      makeUser({
        id: "x1",
        username: "Alpha",
        clan: "Clan",
        overallScore: 50,
        overallName: "2 kyu",
        leaderboardPosition: 3,
      }),
    ];
    const result = selectUserLanguages(users, "overall");
    expect(result[0]).toEqual({
      id: "x1",
      username: "Alpha",
      clan: "Clan",
      score: 50,
      rankName: "2 kyu",
      leaderboardPosition: 3,
    });
  });

  test("uses empty string for missing clan", () => {
    const users = [makeUser({ clan: undefined })];
    const result = selectUserLanguages(users, "overall");
    expect(result[0].clan).toBe("");
  });

  test("uses null for missing leaderboardPosition", () => {
    const users = [makeUser({ leaderboardPosition: undefined })];
    const result = selectUserLanguages(users, "overall");
    expect(result[0].leaderboardPosition).toBeNull();
  });

  test("filters by specific language — includes user with that language", () => {
    const users = [
      makeUser({
        username: "WithJS",
        languages: { javascript: { score: 30 } },
      }),
      makeUser({ username: "NoJS", languages: {} }),
    ];
    const result = selectUserLanguages(users, "javascript");
    expect(result.map((u) => u.username)).toContain("WithJS");
    expect(result.map((u) => u.username)).not.toContain("NoJS");
  });

  test("excludes users without selected language", () => {
    const users = [
      makeUser({ username: "A", languages: {} }),
      makeUser({ username: "B", languages: {} }),
      makeUser({ username: "C", languages: { python: { score: 20 } } }),
    ];
    const result = selectUserLanguages(users, "python");
    expect(result).toHaveLength(1);
    expect(result[0].username).toBe("C");
  });

  test("returns language-specific score, not overall score", () => {
    const users = [
      makeUser({ overallScore: 200, languages: { javascript: { score: 50 } } }),
    ];
    const result = selectUserLanguages(users, "javascript");
    expect(result[0].score).toBe(50);
  });

  test("returns empty array for empty input", () => {
    expect(selectUserLanguages([], "overall")).toEqual([]);
  });

  test("handles tied scores — returns all tied users", () => {
    const users = [
      makeUser({ username: "A", overallScore: 100 }),
      makeUser({ username: "B", overallScore: 100 }),
    ];
    const result = selectUserLanguages(users, "overall");
    expect(result).toHaveLength(2);
  });
});
