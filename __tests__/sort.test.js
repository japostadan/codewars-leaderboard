import { compareLeaderboardValues } from "../src/sort.js";

describe("compareLeaderboardValues", () => {
  test("treats empty string as least value in ascending sort", () => {
    const values = ["", "50", "20"];
    values.sort((a, b) => compareLeaderboardValues(a, b, true));
    expect(values).toEqual(["20", "50", ""]);
  });

  test("treats N/A as least value in ascending sort", () => {
    const values = ["N/A", "10", "200"];
    values.sort((a, b) => compareLeaderboardValues(a, b, true));
    expect(values).toEqual(["10", "200", "N/A"]);
  });

  test("keeps missing values at bottom in descending sort", () => {
    const values = ["", "N/A", "10", "200"];
    values.sort((a, b) => compareLeaderboardValues(a, b, false));
    expect(values).toEqual(["200", "10", "", "N/A"]);
  });

  test("treats whitespace-only values as missing", () => {
    const values = ["   ", "7", "1"];
    values.sort((a, b) => compareLeaderboardValues(a, b, true));
    expect(values).toEqual(["1", "7", "   "]);
  });

  test("treats null and undefined as missing", () => {
    const values = [undefined, 5, null, 10];
    values.sort((a, b) => compareLeaderboardValues(a, b, true));
    expect(values[0]).toBe(5);
    expect(values[1]).toBe(10);
    expect(values.slice(2)).toEqual(expect.arrayContaining([undefined, null]));
  });

  test("sorts numeric strings numerically", () => {
    const values = ["100", "2", "30"];
    values.sort((a, b) => compareLeaderboardValues(a, b, true));
    expect(values).toEqual(["2", "30", "100"]);
  });
});
