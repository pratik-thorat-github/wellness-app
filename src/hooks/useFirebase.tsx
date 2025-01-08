import { useEffect } from "react";
import { useAtom } from "jotai/react";
import { userDetailsAtom, accessTokenAtom } from "../atoms/atom";
import { trackEvent } from "../firebase/config";


export const useFirebase = (): void => {
  const [userDetails] = useAtom(userDetailsAtom);
  const [accessToken] = useAtom(accessTokenAtom);

  //Track user login
  useEffect((): void => {
    if (userDetails && accessToken) {
      trackEvent("user_login", {
        userId: userDetails.id,
        method: "otp",
        platform_info: window.platformInfo,
      });
    }
  }, [userDetails, accessToken]);

  //Track Page View
  useEffect((): (() => void) => {
    const trackPageView = (): void => {
      trackEvent("page_view", {
        path: window.location.pathname,
        user_id: userDetails?.id,
      });
    };

    trackPageView();
    window.addEventListener("popstate", trackPageView);

    return () => {
      window.addEventListener("popstate", trackPageView);
    };
  }, [userDetails]);
};
