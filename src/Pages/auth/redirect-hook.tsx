import { useAtom } from "jotai/react";
import { accessTokenAtom, userDetailsAtom } from "../../atoms/atom";
import { navigate } from "@reach/router";
import { useEffect } from "react";

const useAuthRedirect = () => {
  const [accessToken] = useAtom(accessTokenAtom);
  const [userDetails] = useAtom(userDetailsAtom);

  const isUserLoggedIn=  accessToken || userDetails

  useEffect(() => {
    if( !isUserLoggedIn){
      if(window.location.pathname!=='/login'){
        navigate("/login")
      }
    }
    else{
      navigate("/")
    }
  }, []);
};

export default useAuthRedirect;
