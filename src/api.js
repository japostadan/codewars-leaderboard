/*
* @param username : string
* @returns userData : object
* @throws Error if user not found
* description: This function fetches user data from the Codewars API based on the provided username. It returns the user data as an object if the request is successful. If the user is not found, it throws an error with a message indicating that the user was not found.
*/

export async function getUserData(username) {
  const response = await fetch(
    `https://www.codewars.com/api/v1/users/${username}`
  );
  const userData = await response.json();

  if (!response.ok) {
    throw new Error(`User ${username} not found`);
  }
  return userData;
}