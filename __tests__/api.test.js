import nock from "nock";

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
  });


});