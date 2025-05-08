export function formatPlural(
  count: number,
  { singular, plural }: { singular: string; plural: string },
  { incudeCount = true } = {}
) {
  const word = count === 1 ? singular : plural;

  return incudeCount ? `${count} ${word}` : word;
}
