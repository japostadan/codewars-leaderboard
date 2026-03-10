// ==================== getUserLanguages ====================
export function getUserLanguages(users) {
  const languagesSet = new Set();

  users.forEach((user) => {
    if (user.ranks && user.ranks.languages) {
      Object.keys(user.ranks.languages).forEach((language) =>
        languagesSet.add(language),
      );
    }
  });

  return ["overall", ...Array.from(languagesSet)];
}

// ==================== selectUserLanguages ====================
export function selectUserLanguages(users, selectedLanguage) {
  return users
    .map((user) => {
      let score;

      if (selectedLanguage === "overall") {
        score = user.ranks.overall.score;
      } else {
        const languageData = user.ranks.languages[selectedLanguage];
        if (!languageData) return null;
        score = languageData.score;
      }

      return {
        id: user.id,
        username: user.username,
        clan: user.clan || "",
        score,
        rankName: user.ranks.overall.name,
        honor: user.honor || null,
        leaderboardPosition: user.leaderboardPosition || null,
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score);
}

