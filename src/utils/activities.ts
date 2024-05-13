import { toLetterCase } from "./string-operation";

export function concatAndUpperCaseActivities(activities: string[]) {
  return activities.map((a) => toLetterCase(a)).join(", ");
}
