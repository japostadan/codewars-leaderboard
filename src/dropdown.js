// ==================== renderLanguageList ====================
export function renderLanguageList(languages) {
  const select = document.getElementById("language-filter");
  select.innerHTML = "";

  const overallOption = document.createElement("option");
  overallOption.value = "overall";
  overallOption.textContent = "Overall";
  select.appendChild(overallOption);

  languages
    .filter((l) => l !== "overall")
    .sort((a, b) => a.localeCompare(b))
    .forEach((lang) => {
      const opt = document.createElement("option");
      opt.value = lang;
      opt.textContent = lang;
      select.appendChild(opt);
    });
}
