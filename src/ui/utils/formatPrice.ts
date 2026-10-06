export function formatPrice(priceCents: number): string {
  return `R$ ${(priceCents / 100).toFixed(2).replace('.', ',')}`;
}
