import { useAtom } from "jotai/react";
import { accessTokenAtom, userDetailsAtom } from "../../atoms/atom";
import { navigate } from "@reach/router";
import { useEffect } from "react";

const useAuthRedirect = () => {
  const [accessToken] = useAtom(accessTokenAtom);
  const [userDetails] = useAtom(userDetailsAtom);

  useEffect(() => {
    if (!accessToken || !userDetails) navigate("/login");
    else navigate("/home");
  }, [accessToken, userDetails]);
};

export default useAuthRedirect;
