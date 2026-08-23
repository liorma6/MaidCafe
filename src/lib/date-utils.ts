export function formatEventDate(date: string): string {
  return new Date(date).toLocaleDateString("he-IL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatEventDateRange(startDate: string, endDate?: string | null): string {
  const start = formatEventDate(startDate);
  if (!endDate) return start;
  const end = formatEventDate(endDate);
  if (start === end) return start;
  return `${start} – ${end}`;
}
