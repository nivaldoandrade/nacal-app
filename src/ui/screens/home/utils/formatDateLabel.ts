export function formatDateLabel(date: Date) {
  const now = new Date();

  const isToday = date.toDateString() === now.toDateString();

  const dateFormatted = new Intl.DateTimeFormat('pt-BR', {
    weekday: isToday ? undefined : 'long',
    day: 'numeric',
    month: 'long',
  }).format(date).toUpperCase();

  return isToday ? `HOJE, ${dateFormatted}` : dateFormatted;
}
