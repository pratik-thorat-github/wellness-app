import { useAtom } from "jotai/react";
import { accessTokenAtom, userDetailsAtom, afterLoginRedirectAtom } from "../../atoms/atom";
import { navigate } from "@reach/router";
import { useEffect } from "react";

const useAuthRedirect = () => {
  const [accessToken] = useAtom(accessTokenAtom);
  const [userDetails] = useAtom(userDetailsAtom);
  const [afterLoginRedirect, setAfterLoginRedirect] = useAtom(afterLoginRedirectAtom);

  const isUserLoggedIn=  accessToken || userDetails

  useEffect(() => {
    if (!isUserLoggedIn) {
      if (window.location.pathname !== '/login') {
        navigate("/login");
      }
    } else {
      if (afterLoginRedirect?.afterLoginUrl) {
        const redirectUrl = afterLoginRedirect.afterLoginUrl;
        setAfterLoginRedirect(null); // Clear the redirect URL after using it
        navigate(redirectUrl);
      } else {
        navigate("/");
      }
    }
  }, [isUserLoggedIn, afterLoginRedirect]);
};

export default useAuthRedirect;
