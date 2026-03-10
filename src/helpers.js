export function debounce(fn, delay = 300) {
  let timeoutId;

  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

export function parseUsernames(rawValue) {
  return rawValue
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean);
}

export function splitSettledResults(usernames, settledResults) {
  const users = [];
  const failures = [];

  settledResults.forEach((result, index) => {
    if (result.status === "fulfilled") {
      users.push(result.value);
      return;
    }

    failures.push({
      username: usernames[index],
      message: result.reason?.message || "Request failed",
    });
  });

  return { users, failures };
}

export function buildFailureMessage(failures) {
  if (!failures.length) return "";

  const details = failures
    .map(({ username, message }) => `${username}: ${message}`)
    .join("; ");

  return `Some users could not be loaded: ${details}`;
}

export function setButtonLoadingState(button, isLoading) {
  if (!button) return;

  button.disabled = isLoading;
  button.textContent = isLoading ? "Fetching..." : "Fetch";
}

export function getBorderColorByRank(index) {
  if (index === 0) return "#facc15";
  if (index === 1) return "#cbd5e1";
  if (index === 2) return "#d97706";
  return "#334155";
}