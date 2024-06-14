export function toLetterCase(str: string) {
  let firstChar = str[0];
  let restString = str.slice(1);

  if (str == "hiit") return "HIIT";
  if (str === "pt") return "PT";

  return `${firstChar.toUpperCase()}${restString.toLowerCase()}`;
}

export function toLetterCaseNoUnderscore(str: string) {
  let lowerCaseString = str.toLowerCase();

    // Replace underscores with spaces
    let stringWithSpaces = lowerCaseString.replace(/_/g, ' ');

    // Capitalize the first letter of each word
    let transformedString = stringWithSpaces.replace(/\b\w/g, function(char) {
        return char.toUpperCase();
    });
    if(str==='TRAINING_1_ON_1'){
      return '1:1 Training'
    }

    return transformedString;
}

export function checkIfDayPass(str: string) {
  str = str.toLowerCase();
  str = str.replace(/ /g, "_");

  if (str == "day_pass") return true;
  else return false;
}
