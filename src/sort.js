function isMissingSortValue(value) {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return normalized === "" || normalized === "n/a";
  }
  return false;
}

function isNumericSortValue(value) {
  if (typeof value === "number") return !Number.isNaN(value);
  if (typeof value !== "string") return false;
  const trimmed = value.trim();
  if (trimmed === "") return false;
  return !Number.isNaN(Number(trimmed));
}

export function compareLeaderboardValues(valA, valB, asc) {
  const aMissing = isMissingSortValue(valA);
  const bMissing = isMissingSortValue(valB);

  // Keep missing values at the bottom for both sort directions.
  if (aMissing && bMissing) return 0;
  if (aMissing) return 1;
  if (bMissing) return -1;

  if (isNumericSortValue(valA) && isNumericSortValue(valB)) {
    const numA = Number(valA);
    const numB = Number(valB);
    return asc ? numA - numB : numB - numA;
  }

  return asc
    ? String(valA).localeCompare(String(valB), undefined, { numeric: true })
    : String(valB).localeCompare(String(valA), undefined, { numeric: true });
}
