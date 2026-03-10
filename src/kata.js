const MAX_DISPLAYED_LANGUAGES = 3;

function formatDate(value) {
  if (!value) return "Unknown date";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown date";

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function renderKataStatus(containerEl, message) {
  containerEl.innerHTML = `<p class="kata-status">${escapeHtml(message)}</p>`;
}

export function renderKataList(containerEl, katas) {
  if (!katas.length) {
    renderKataStatus(containerEl, "No completed katas found for this user.");
    return;
  }

  const items = katas
    .map((kata) => {
      const escapedName = escapeHtml(kata.name || "Untitled kata");
      const escapedId = escapeHtml(kata.id || "");
      const completedAt = formatDate(kata.completedAt);
      const languages = Array.isArray(kata.completedLanguages)
        ? kata.completedLanguages.slice(0, MAX_DISPLAYED_LANGUAGES)
        : [];

      const languageTags = languages
        .map(
          (language) => `<span class="kata-tag">${escapeHtml(language)}</span>`,
        )
        .join("");

      return `
        <article class="kata-item">
          <a class="kata-name" href="https://www.codewars.com/kata/${escapedId}" target="_blank" rel="noopener noreferrer">${escapedName}</a>
          <div class="kata-meta">
            <span>${escapeHtml(completedAt)}</span>
            ${languageTags}
          </div>
        </article>
      `;
    })
    .join("");

  containerEl.innerHTML = items;
}

