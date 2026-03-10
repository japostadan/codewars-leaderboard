import nock from "nock";
import { fetchUserData } from "../src/api";

describe("fetch reuests to API", () => {
  afterEach(() => {
    nock.cleanAll();
  });

  // Test to get user data from API
  it("should return user data on successful response", async () => {
    const mockGetUserResponse = {
      username: "testuser",
      clan: "testclan",
      ranks: {
        overall: 100,
        languages: {},
      },
    };


  const scope = nock("https://www.codewars.com")
      .get("/api/v1/users/testuser")
      .reply(200, mockGetUserResponse);

    const result = await fetchUserData("testuser");

    expect(result.username).toBe("testuser");
    expect(result.clan).toBe("testclan");
    expect(scope.isDone()).toBe(true);
  });

  // Check if user not found from parameter username, it should throw an error with message "User {username} not found"
    test("throws error on network error", async () => {
    nock("https://www.codewars.com")
      .get("/api/v1/users/testuser")
      .replyWithError("Network error");

    await expect(fetchUserData("testuser")).rejects.toThrow("Network error");
  }
  );

  test("throws error if user not found", async () => {
    nock("https://www.codewars.com")
      .get("/api/v1/users/nonexistentuser")
      .reply(404, { message: "User not found" });

    await expect(fetchUserData("nonexistentuser")).rejects.toThrow(
      "User nonexistentuser not found"
    );
  });

  test("throw error on network error", async () => {
    nock("https://www.codewars.com")
      .get("/api/v1/users/testuser")
      .replyWithError("Network error");

    await expect(fetchUserData("testuser")).rejects.toThrow("Network error");
  });

 
});