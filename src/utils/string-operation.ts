export function toLetterCase(str: string) {
  let firstChar = str[0];
  let restString = str.slice(1);

  if (str == "hiit") return "HIIT";

  return `${firstChar.toUpperCase()}${restString.toLowerCase()}`;
}
