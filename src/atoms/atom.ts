import { atomWithStorage, createJSONStorage } from "jotai/utils";
import IUser, { IPlusDetails } from "../types/user";

const storage = createJSONStorage(() => localStorage);
export const accessTokenAtom = atomWithStorage(
  "zenfitx-access-token",
  "",
  storage
);

const userDetailsStorage = createJSONStorage<IUser | null>(() => localStorage);
export const userDetailsAtom = atomWithStorage<IUser | null>(
  "zenfitx-user-details",
  null,
  userDetailsStorage
);

const plusDetailsStorage = createJSONStorage<IPlusDetails | null>(
  () => localStorage
);
export const plusDetailsAtom = atomWithStorage<IPlusDetails | null>(
  "zenfitx-plus-details",
  null,
  plusDetailsStorage
);
