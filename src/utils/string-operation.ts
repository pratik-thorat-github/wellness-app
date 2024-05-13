export function toLetterCase(str: string) {
  let firstChar = str[0];
  let restString = str.slice(1);
  return `${firstChar.toUpperCase()}${restString.toLowerCase()}`;
}
