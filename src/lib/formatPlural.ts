export function formatPlural(
  count: number,
  { singular, plural }: { singular: string; plural: string },
  { incudeCount = true } = {}
) {
  const word = count === 1 ? singular : plural;

  return incudeCount ? `${count} ${word}` : word;
}

export function formatPrice(amount: number, showZeroAsNumber = false) {
  const formatter = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  });

  if (amount === 0 && !showZeroAsNumber) return "Free";
  return formatter.format(amount);
}

const DATE_FORMATER = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

export function formatDate(date: Date) {
  return DATE_FORMATER.format(date);
}
