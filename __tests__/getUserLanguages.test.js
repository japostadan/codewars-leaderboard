// ==================== getUserLanguages ====================
import { getUserLanguages } from "../src/main.js";

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

describe("getUserLanguages", () => {
  it("should return an array of languages for a user", () => {
    const userData = makeUser({
      languages: {
        javascript: { rank: 1, score: 100 },
        python: { rank: 2, score: 90 },
      },
    });
    const languages = getUserLanguages(userData);
    expect(languages).toEqual(["overall", "javascript", "python"]);
  });

  it("should return an empty array if user has no languages", () => {
    const userData = makeUser({
      languages: {},
    });
    const languages = getUserLanguages(userData);
    expect(languages).toEqual(["overall"]);
  });
});

