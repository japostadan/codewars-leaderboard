import nock from "nock";
import { getUserData } from "../src/api";

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

    const result = await getUserData("testuser");

    expect(result.username).toBe("testuser");
    expect(result.clan).toBe("testclan");
    expect(scope.isDone()).toBe(true);
  });
});