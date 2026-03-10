/**
 * @jest-environment jsdom
 */

import { renderLanguageList } from "../src/dropdown.js";

beforeEach(() => {
  document.body.innerHTML = `<select id="language-filter"></select>`;
});

function getOptions() {
  return Array.from(document.getElementById("language-filter").options);
}

describe("renderLanguageList", () => {
  test("first option is always 'Overall' with value 'overall'", () => {
    renderLanguageList(["javascript", "python"]);
    const first = getOptions()[0];
    expect(first.value).toBe("overall");
    expect(first.textContent).toBe("Overall");
  });

  test("filters out 'overall' from input before sorting — no duplicate", () => {
    renderLanguageList(["overall", "python", "javascript"]);
    const values = getOptions().map((o) => o.value);
    const overallCount = values.filter((v) => v === "overall").length;
    expect(overallCount).toBe(1);
  });

  test("sorts languages alphabetically", () => {
    renderLanguageList(["python", "javascript", "ruby"]);
    const values = getOptions().map((o) => o.value);
    // first is overall, then sorted langs
    expect(values).toEqual(["overall", "javascript", "python", "ruby"]);
  });

  test("handles empty array — only Overall option", () => {
    renderLanguageList([]);
    expect(getOptions()).toHaveLength(1);
    expect(getOptions()[0].value).toBe("overall");
  });

  test("creates correct number of options", () => {
    renderLanguageList(["overall", "python", "js"]);
    // overall + 2 langs = 3
    expect(getOptions()).toHaveLength(3);
  });
});
