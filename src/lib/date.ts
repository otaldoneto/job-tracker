export function formatDaysAgo(date: Date | string): string {
  const diffMs = Date.now() - new Date(date).getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return "hoje";
  if (diffDays === 1) return "ontem";
  return `há ${diffDays} dias`;
}
