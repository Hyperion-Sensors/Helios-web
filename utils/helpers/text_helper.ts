// Removes underscores and capitalizes first letter of each word
export function parseWord(word: string) {
  return word.replace(/_/g, " ").replace(/\b\w/g, function (match) {
    return match.toUpperCase();
  });
}
