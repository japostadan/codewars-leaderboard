import { fetchUserData } from "./api.js";
import { getUserLanguages, selectUserLanguages } from "./language.js";
import { renderLanguageList } from "./dropdown.js";
import { renderStats } from "./stats.js";
import { compareLeaderboardValues } from "./sort.js";
import { saveCache, loadCache } from "./cache.js";

const addUsersForm = document.getElementById("fetch-users-form");
const usernameInput = document.getElementById("username-input");
const leaderboardBody = document.getElementById("leaderboard-body");
const errorBanner = document.getElementById("error-banner");
const usernameSearch = document.getElementById("username-search");
const languageFilter = document.getElementById("language-filter");
const leaderboardTitle = document.getElementById("leaderboard-headers");
const themeToggle = document.getElementById("theme-toggle");

let usersData = [];
let currentSort = { key: "score", asc: false };

// Load from cache on startup
document.addEventListener("DOMContentLoaded", () => {
  const cached = loadCache();
  if (cached) {
    usersData = cached;
    const userLanguages = getUserLanguages(usersData);
    renderLanguageList(userLanguages);

    renderLeaderboard("overall");
  }
  const savedTheme = localStorage.getItem("cw-theme");
  if (savedTheme === "light") document.body.classList.add("light");
});

// ==================== Fetch Users & Initialize ====================
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
      saveCache(usersData);
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
    updateStats([]);
    return;
  }

  leaderboard.sort((a, b) => {
    const valA = a[currentSort.key];
    const valB = b[currentSort.key];
    return compareLeaderboardValues(valA, valB, currentSort.asc);
  });

  leaderboard.forEach((user, index) => {
    const row = document.createElement("tr");
     if (index === 0) row.classList.add("rank-1");
    if (index === 1) row.classList.add("rank-2");
    if (index === 2) row.classList.add("rank-3");

    const borderColor =
      index === 0
        ? "#facc15"
        : index === 1
          ? "#cbd5e1"
          : index === 2
            ? "#d97706"
            : "#334155";

    row.innerHTML = `
      <td class="rank">${index + 1}</td>
      <td class="player-cell">
         <span class="kyu-badge">${user.rankName}</span>
        <span style="color:${borderColor}">●</span>
        <img src="https://www.codewars.com/avatars/${user.id}" class="avatar" style="border-color:${borderColor}" alt="${user.username} avatar"/>
 <span>${user.username}</span>
      </td>
      <td class="honor">${user.honor !== null ? user.honor : "N/A"}</td>
      <td>${user.clan || ""}</td>
      <td>
        ${user.score}
      </td>
      <td>
        ${user.leaderboardPosition !== null ? user.leaderboardPosition : ""}
      </td>
    `;

    const img = row.querySelector("img");
    img.onerror = () => {
      img.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=1a1a2e&color=b0b0c0&size=40`;
    };

    leaderboardBody.appendChild(row);
  });

  renderStats(leaderboard);
}

leaderboardTitle.querySelectorAll("th").forEach((header) => {
  const sortIcon = document.createElement("span");
  sortIcon.classList.add("sort-icon");
  header.appendChild(sortIcon);

  header.addEventListener("click", () => {
    const key = header.dataset.sort;
    if (!key) return;

    if (currentSort.key === key) {
      currentSort.asc = !currentSort.asc;
    } else {
      currentSort.key = key;
      currentSort.asc = true;
    }

    renderLeaderboard(
      languageFilter.value,
      usernameSearch.value.trim().toLowerCase(),
    );

    leaderboardTitle.querySelectorAll("th").forEach((th) => {
      th.classList.remove("active-sort", "sort-desc");
      const icon = th.querySelector(".sort-icon");
      if (icon) icon.textContent = "";
    });

    header.classList.add("active-sort");
    if (!currentSort.asc) header.classList.add("sort-desc");

    sortIcon.textContent = currentSort.asc ? "▲" : "▼";
  });
});

// ==================== Theme Toggle ====================
themeToggle.addEventListener("click", () => {
  themeToggle.textContent = document.body.classList.toggle("light")
    ? "🌑️"
    : "☀️";
  const isLight = document.body.classList.toggle("dark");
  localStorage.setItem("cw-theme", isLight ? "light" : "dark");
});