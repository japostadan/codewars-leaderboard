import { fetchUserData } from "./api.js";
import { getUserLanguages } from "./language.js";

const hasDocument = typeof document !== "undefined";
const addUsersForm = hasDocument
  ? document.getElementById("fetch-users-form")
  : null;
const usernameInput = hasDocument
  ? document.getElementById("username-input")
  : null;
const errorBanner = hasDocument
  ? document.getElementById("error-banner")
  : null;
const leaderboardBody = hasDocument
  ? document.getElementById("leaderboard-body")
  : null;
const languageFilter = hasDocument
  ? document.getElementById("language-filter")
  : null;

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
      console.log("User Languages:", userLanguages);
    } catch (err) {
      leaderboardBody.innerHTML = "";
      errorBanner.textContent = err.message || "Something went wrong";
    }
    console.log(usersData);
  });
}

