export function formatCurrency(
  value: number,
  locale: string = 'fr-FR',
  currency: string = 'EUR'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}
