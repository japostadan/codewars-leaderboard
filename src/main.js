import { fetchUserData } from "./api.js";
import { getUserLanguages, selectUserLanguages } from "./language.js";
import { renderLanguageList } from "./dropdown.js";
import { renderStats } from "./stats.js";
import { compareLeaderboardValues } from "./sort.js";
import { saveCache, loadCache } from "./cache.js";
import {
  debounce,
  parseUsernames,
  splitSettledResults,
  buildFailureMessage,
  setButtonLoadingState,
  getBorderColorByRank,
} from "./helpers.js";

const addUsersForm = document.getElementById("fetch-users-form");
const usernameInput = document.getElementById("username-input");
const leaderboardBody = document.getElementById("leaderboard-body");
const errorBanner = document.getElementById("error-banner");
const usernameSearch = document.getElementById("username-search");
const languageFilter = document.getElementById("language-filter");
const leaderboardTitle = document.getElementById("leaderboard-headers");
const themeToggle = document.getElementById("theme-toggle");
const fetchBtn = addUsersForm?.querySelector(".fetch-btn");

let usersData = [];
let currentSort = { key: "score", asc: false };
let isFetching = false;

function getActiveFilterText() {
  return usernameSearch?.value.trim().toLowerCase() || "";
}

function renderActiveLeaderboard() {
  renderLeaderboard(languageFilter?.value || "overall", getActiveFilterText());
}

function showBanner(message, kind = "error") {
  if (!errorBanner) return;

  errorBanner.textContent = message;

  if (kind === "warning") {
    errorBanner.style.backgroundColor = "#fef3c7";
    errorBanner.style.color = "#92400e";
    return;
  }

  errorBanner.style.backgroundColor = "#fee2e2";
  errorBanner.style.color = "#991b1b";
}

function clearBanner() {
  if (!errorBanner) return;

  errorBanner.textContent = "";
  errorBanner.style.backgroundColor = "";
  errorBanner.style.color = "";
}

function renderEmptyState() {
  leaderboardBody.innerHTML =
    '<tr><td colspan="6" class="empty-state">No data available.</td></tr>';
  renderStats([]);
}

function renderLoadingState() {
  leaderboardBody.innerHTML = '<tr><td colspan="6">Loading...</td></tr>';
}

function createPlayerRow(user, index) {
  const row = document.createElement("tr");

  if (index === 0) row.classList.add("rank-1");
  if (index === 1) row.classList.add("rank-2");
  if (index === 2) row.classList.add("rank-3");

  const borderColor = getBorderColorByRank(index);

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
      <td>${user.score}</td>
      <td>${user.leaderboardPosition !== null ? user.leaderboardPosition : ""}</td>
    `;

  const avatar = row.querySelector("img");
  avatar.onerror = () => {
    avatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=1a1a2e&color=b0b0c0&size=40`;
  };

  return row;
}

async function fetchUsers(usernames) {
  const settled = await Promise.allSettled(usernames.map(fetchUserData));
  return splitSettledResults(usernames, settled);
}

async function handleSubmit(event) {
  event.preventDefault();
  if (isFetching) return;

  const usernames = parseUsernames(usernameInput.value);
  if (!usernames.length) {
    showBanner("Enter at least one username.");
    return;
  }

  isFetching = true;
  clearBanner();
  renderLoadingState();
  setButtonLoadingState(fetchBtn, true);

  try {
    const { users, failures } = await fetchUsers(usernames);
    usersData = users;

    if (!usersData.length) {
      showBanner("No users were loaded.");
      renderEmptyState();
      return;
    }

    saveCache(usersData);
    renderLanguageList(getUserLanguages(usersData));
    renderActiveLeaderboard();

    const failureMessage = buildFailureMessage(failures);
    if (failureMessage) {
      showBanner(failureMessage, "warning");
    }
  } catch (error) {
    showBanner(error.message || "Something went wrong");
    renderEmptyState();
  } finally {
    isFetching = false;
    setButtonLoadingState(fetchBtn, false);
  }
}

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

// ==================== Filter & Search Listeners ====================
const debouncedRender = debounce(() => {
  renderActiveLeaderboard();
}, 300);

if (languageFilter) {
  languageFilter.addEventListener("change", debouncedRender);
}

if (usernameSearch) {
  usernameSearch.addEventListener("input", debouncedRender);
}

// ==================== Fetch Users & Initialize ====================
if (addUsersForm && usernameInput && errorBanner && leaderboardBody) {
  addUsersForm.addEventListener("submit", handleSubmit);
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
    renderEmptyState();
    return;
  }

  leaderboard.sort((a, b) => {
    const valA = a[currentSort.key];
    const valB = b[currentSort.key];
    return compareLeaderboardValues(valA, valB, currentSort.asc);
  });

  leaderboard.forEach((user, index) => {
    leaderboardBody.appendChild(createPlayerRow(user, index));
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

    renderActiveLeaderboard();

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
  const isLightMode = document.body.classList.toggle("light");
  themeToggle.textContent = isLightMode ? "🌑️" : "☀️";
  localStorage.setItem("cw-theme", isLightMode ? "light" : "dark");
});