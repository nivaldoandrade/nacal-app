export function daysUntil(target: Date | null | undefined, now: Date): number {
  if (!target) {
    return 0;
  }

  const startOfDay = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

  return Math.max(0, Math.round((startOfDay(target) - startOfDay(now)) / 86_400_000));
}
