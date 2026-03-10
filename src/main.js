import { fetchUserData } from "./api.js";
import { getUserLanguages, selectUserLanguages } from "./language.js";
import { renderLanguageList } from "./dropdown.js";
import { renderStats } from "./stats.js";

const addUsersForm = document.getElementById("fetch-users-form");
const usernameInput = document.getElementById("username-input");
const leaderboardBody = document.getElementById("leaderboard-body");
const errorBanner = document.getElementById("error-banner");
const usernameSearch = document.getElementById("username-search");
const languageFilter = document.getElementById("language-filter");

let usersData = [];

// ==================== Fetch Users ====================
if (addUsersForm && usernameInput && errorBanner && leaderboardBody) {
  addUsersForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    errorBanner.textContent = "";
    leaderboardBody.innerHTML = `<tr><td colspan="6">Loading...</td></tr>`;

    const usernames = usernameInput.value
      .split(",")
      .map((u) => u.trim())
      .filter(Boolean);
    if (!usernames.length)
      return (errorBanner.textContent = "Enter at least one username.");

    try {
      usersData = await Promise.all(usernames.map(fetchUserData));
      const userLanguages = getUserLanguages(usersData);

      renderLanguageList(userLanguages);
      renderLeaderboard(languageFilter.value);
    } catch (err) {
      leaderboardBody.innerHTML = "";
      errorBanner.textContent = err.message || "Something went wrong";
    }

    languageFilter.addEventListener("change", () => {
      renderLeaderboard(
        languageFilter.value,
        usernameSearch.value.trim().toLowerCase(),
      );
    });

    usernameSearch.addEventListener("input", () => {
      renderLeaderboard(
        languageFilter.value,
        usernameSearch.value.trim().toLowerCase(),
      );
    });
  });
}

// ==================== Render Leaderboard ====================
function renderLeaderboard(language, filter = "") {
  leaderboardBody.innerHTML = "";
  let leaderboard = selectUserLanguages(usersData, language);

  if (filter)
    leaderboard = leaderboard.filter((u) =>
      u.username.toLowerCase().includes(filter),
    );
  if (!leaderboard.length) {
    leaderboardBody.innerHTML = `<tr><td colspan="6" class="empty-state">No data available.</td></tr>`;
    return;
  }

  leaderboard.forEach((user, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td class="rank">${index + 1}</td>
      <td class="player-cell">
        <span class="kyu-badge">${user.rankName}</span>
        <span style="color:#000">●</span>
        <span>${user.username}</span>
      </td>
      <td>${user.clan || ""}</td>
      <td>
        ${user.score}
      </td>
      <td>${user.leaderboardPosition || "N/A"}</td>
    `;

    leaderboardBody.appendChild(row);
  });

  renderStats(leaderboard);
}
