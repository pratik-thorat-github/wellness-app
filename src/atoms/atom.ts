import { atomWithStorage, createJSONStorage } from "jotai/utils";
import IUser, { IPlusDetails } from "../types/user";
import { IBookNowFooter } from "../Pages/checkout/book-now-footer";

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

const checkoutSdkRedirectStorage = createJSONStorage<IBookNowFooter | null>(
  () => localStorage
);
export const checkoutSdkRedirectAtom = atomWithStorage<IBookNowFooter | null>(
  "zenfitx-batch-checkout-details",
  null,
  checkoutSdkRedirectStorage
);
