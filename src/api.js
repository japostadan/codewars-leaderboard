async function fetchJsonWithTimeout(url, errorLabel, notFoundMessage) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(url, { signal: controller.signal });

    let payload = null;
    try {
      payload = await response.json();
    } catch {
      payload = null;
    }

    if (!response.ok) {
      const message =
        response.status === 404 && notFoundMessage
          ? notFoundMessage
          : payload?.reason || payload?.message || `${errorLabel} failed`;
      throw new Error(message);
    }

    return payload;
  } catch (err) {
    if (err.name === "AbortError") {
      throw new Error(`${errorLabel} timed out`);
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}

/*
 * @param username : string
 * @returns fetchUserData : object
 * @throws Error if user not found
 */
export async function fetchUserData(username) {
  return fetchJsonWithTimeout(
    `https://www.codewars.com/api/v1/users/${username}`,
    `User ${username}`,
    `User ${username} not found`,
  );
}

/*
 * @param username : string
 * @returns list of completed code challenges
 */
export async function fetchCompletedKatas(username, page = 0) {
  const payload = await fetchJsonWithTimeout(
    `https://www.codewars.com/api/v1/users/${username}/code-challenges/completed?page=${page}`,
    `Completed katas for ${username}`,
  );

  return payload?.data || [];
}
