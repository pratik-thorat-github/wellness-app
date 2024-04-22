import { atomWithStorage, createJSONStorage } from "jotai/utils";
import IUser from "../types/user";

const storage = createJSONStorage(() => localStorage);
export const accessTokenAtom = atomWithStorage("access-token", "", storage);

const userDetailsStorage = createJSONStorage<IUser | null>(() => localStorage);
export const userDetailsAtom = atomWithStorage<IUser | null>(
  "user-details",
  null,
  userDetailsStorage
);
