export function toLetterCase(str: string) {
  let firstChar = str[0];
  let restString = str.slice(1);

  if (str == "hiit") return "HIIT";
  if (str === "pt") return "PT";

  return `${firstChar.toUpperCase()}${restString.toLowerCase()}`;
}

export function checkIfDayPass(str: string) {
  str = str.toLowerCase();
  str = str.replace(/ /g, "_");

  if (str == "day_pass") return true;
  else return false;
}
