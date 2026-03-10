export function renderStats(leaderboard) {
  const totalUsersEl = document.getElementById("total-users");
  const highestScoreEl = document.getElementById("highest-score");
  const averageScoreEl = document.getElementById("average-score");

  if (!leaderboard.length) {
    totalUsersEl.textContent = 0;
    highestScoreEl.textContent = 0;
    averageScoreEl.textContent = 0;
    return;
  }

  const total = leaderboard.length;
  const highest = Math.max(...leaderboard.map((u) => u.score));
  const avg = Math.round(leaderboard.reduce((s, u) => s + u.score, 0) / total);
  
  console.log({ total, highest, avg });

  totalUsersEl.textContent = total;
  highestScoreEl.textContent = highest;
  averageScoreEl.textContent = avg;
}
