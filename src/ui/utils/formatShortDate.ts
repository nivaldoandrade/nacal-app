export function formatShortDate(date: Date | null | undefined): string {
  if (!date) {
    return '—';
  }

  return date.toLocaleDateString('pt-BR');
}
