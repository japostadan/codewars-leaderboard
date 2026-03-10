/**
 * @jest-environment jsdom
 */

import { renderStats } from "../src/stats.js";

function makeUser(score) {
  return { score };
}

beforeEach(() => {
  document.body.innerHTML = `
    <span id="total-users"></span>
    <span id="highest-score"></span>
    <span id="average-score"></span>
  `;
});

describe("renderStats", () => {
  test("sets all stats to 0 for empty array", () => {
    renderStats([]);
    expect(document.getElementById("total-users").textContent).toBe("0");
    expect(document.getElementById("highest-score").textContent).toBe("0");
    expect(document.getElementById("average-score").textContent).toBe("0");
  });

  test("calculates total users correctly", () => {
    renderStats([makeUser(10), makeUser(20), makeUser(30)]);
    expect(document.getElementById("total-users").textContent).toBe("3");
  });

  test("finds highest score", () => {
    renderStats([makeUser(10), makeUser(50), makeUser(30)]);
    expect(document.getElementById("highest-score").textContent).toBe("50");
  });

  test("calculates average score (rounded)", () => {
    renderStats([makeUser(10), makeUser(20), makeUser(30)]);
    expect(document.getElementById("average-score").textContent).toBe("20");
  });

  test("handles single user", () => {
    renderStats([makeUser(100)]);
    expect(document.getElementById("total-users").textContent).toBe("1");
    expect(document.getElementById("highest-score").textContent).toBe("100");
    expect(document.getElementById("average-score").textContent).toBe("100");
  });
});
