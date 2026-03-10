import { fetchUserData } from "./api.js";

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

// ==================== getUserLanguages ====================
export function getUserLanguages(users) {
  const userList = Array.isArray(users) ? users : [users];
  const languagesSet = new Set();

  userList.forEach((user) => {
    if (user.ranks && user.ranks.languages) {
      Object.keys(user.ranks.languages).forEach((language) =>
        languagesSet.add(language),
      );
    }
  });

  console.log(languagesSet);
  return ["overall", ...Array.from(languagesSet)];
}

// ==================== selectUserLanguages ====================
export function selectUserLanguages(users, language) {
  return users.filter((user) => {
    if (language === "overall") return true;
    return user.ranks.languages && user.ranks.languages[language];
  });
}

// ==================== renderLanguageList ====================
export function renderLanguageList(languages) {
  const select = document.getElementById("language-filter");
  select.innerHTML = "";

  const overallOption = document.createElement("option");
  overallOption.value = "overall";
  overallOption.textContent = "Overall";
  select.appendChild(overallOption);

  languages
    .filter((l) => l !== "overall")
    .sort((a, b) => a.localeCompare(b))
    .forEach((lang) => {
      const opt = document.createElement("option");
      opt.value = lang;
      opt.textContent = lang;
      select.appendChild(opt);
    });
}
