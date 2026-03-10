import { fetchUserData } from "./api.js";

const addUsersForm = document.getElementById("fetch-users-form");
const usernameInput = document.getElementById("username-input");
const errorBanner = document.getElementById("error-banner");
const leaderboardBody = document.getElementById("leaderboard-body");

let usersData = [];

// ==================== Fetch Users ====================
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

  console.log(languagesSet);
  return ["overall", ...Array.from(languagesSet)];
}

