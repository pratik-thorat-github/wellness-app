import { RouteComponentProps, navigate, useLocation } from "@reach/router";
import { Flex } from "antd";
import Loader from "../../components/Loader";
import { useMutation } from "@tanstack/react-query";
import { verifyOtplessMagicLink } from "../../apis/auth/login";
import { errorToast } from "../../components/Toast";
import { useEffect } from "react";

import { accessTokenAtom, userDetailsAtom } from "../../atoms/atom";
import { useAtom } from "jotai/react";
import useAuthRedirect from "./redirect-hook";
import { Mixpanel } from "../../mixpanel/init";

interface IVerifyMagicLink extends RouteComponentProps {}

function mixpanelEvents(verificationApiResponseUser: any) {
  console.log("sending verification events", verificationApiResponseUser);

  Mixpanel.identify(verificationApiResponseUser.phone);
  Mixpanel.track("Successful login", {
    phone: verificationApiResponseUser.phone,
  });
  Mixpanel.people.set({
    $name: verificationApiResponseUser.name,
    $phone: verificationApiResponseUser.phone,
  });
}

const VerifyMagicLink: React.FC<IVerifyMagicLink> = ({}) => {
  useAuthRedirect();
  const locationQueryParams = useLocation().search;

  const [, setAccessTokenAtom] = useAtom(accessTokenAtom);
  const [, setUserDetailsAtom] = useAtom(userDetailsAtom);

  const { mutate: _verifyOtplessMagicLink } = useMutation({
    mutationFn: verifyOtplessMagicLink,
    onSuccess: (res) => {
      setAccessTokenAtom(res.accessToken);
      setUserDetailsAtom(res.user);
      mixpanelEvents(res.user);

      navigate("/home", { replace: true });
    },
    onError: () => {
      errorToast("Error in verification");
    },
  });

  useEffect(() => {
    let codeToSend = "";
    let phoneToSend = "";

    let codeValue = locationQueryParams.split("code=");
    if (codeValue.length && codeValue[1]) {
      codeToSend = codeValue[1].includes("&")
        ? codeValue[1].split("&") && codeValue[1].split("&")[0]
        : codeValue[1];
    }

    let phoneValue = locationQueryParams.split("phone=");
    if (phoneValue.length && phoneValue[1]) {
      phoneToSend = phoneValue[1].includes("&")
        ? phoneValue[1].split("&") && phoneValue[1].split("&")[0]
        : phoneValue[1];
    }

    if (codeToSend)
      _verifyOtplessMagicLink({ code: codeToSend, phone: phoneToSend });
  }, [locationQueryParams]);

  return (
    <Flex
      vertical
      style={{ minHeight: "88vh" }}
      flex={1}
      justify="center"
      align="center"
    >
      <Flex vertical flex={1} justify="center" align="center">
        <span> Verifying that its you!! </span>
        <span style={{ marginTop: "16px" }}>
          {" "}
          <Loader />{" "}
        </span>
      </Flex>
    </Flex>
  );
};

export default VerifyMagicLink;
