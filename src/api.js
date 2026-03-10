/*
 * @param username : string
 * @returns fetchUserData : object
 * @throws Error if user not found
 * description: This function fetches user data from the Codewars API based on the provided username. It returns the user data as an object if the request is successful. If the user is not found, it throws an error with a message indicating that the user was not found.
 */

export async function fetchUserData(username) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

  try {
    const response = await fetch(
      `https://www.codewars.com/api/v1/users/${username}`,
      { signal: controller.signal }
    );

    if (!response.ok) {
      throw new Error(`User ${username} not found`);
    }

    const userData = await response.json();
    return userData;
  } catch (err) {
    if (err.name === "AbortError") {
      throw new Error(`Request timeout for user ${username}`);
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}
