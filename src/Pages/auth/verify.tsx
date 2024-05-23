import { RouteComponentProps, navigate, useLocation } from "@reach/router";
import { Button, Flex, Input } from "antd";
import Loader from "../../components/Loader";
import { useMutation } from "@tanstack/react-query";
import {
  checkUserPhoneAndResendOtp,
  checkUserPhoneAndSendOtp,
  verifyOtplessMagicLink,
  verifyOtplessOtp,
} from "../../apis/auth/login";
import { errorToast } from "../../components/Toast";
import { useEffect, useState } from "react";
import { InputOTP } from "antd-input-otp"; // Don't forget to import this too!

import "./style.css";

import {
  accessTokenAtom,
  checkoutSdkRedirectAtom,
  userDetailsAtom,
} from "../../atoms/atom";
import { useAtom } from "jotai/react";
import useAuthRedirect from "./redirect-hook";
import { Mixpanel } from "../../mixpanel/init";
import colors from "../../constants/colours";

interface IVerifyMagicLink extends RouteComponentProps {
  otpLessOrderId?: string;
  phoneNumber?: string;
}

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

const VerifyMagicLink: React.FC<IVerifyMagicLink> = ({
  otpLessOrderId,
  phoneNumber,
}) => {
  // useAuthRedirect();
  const locationQueryParams = useLocation().search;

  let locationStates = useLocation().state;
  let phoneNumberFromState = locationStates
    ? (locationStates as any).phoneNumber
    : null;
  let otpLessOrderIdFromLocState = locationStates
    ? (locationStates as any).otpLessOrderId
    : null;

  otpLessOrderId = otpLessOrderId || otpLessOrderIdFromLocState;
  phoneNumber = phoneNumber || phoneNumberFromState;

  const [, setAccessTokenAtom] = useAtom(accessTokenAtom);
  const [, setUserDetailsAtom] = useAtom(userDetailsAtom);
  const [checkoutSdkRedirectProps] = useAtom(checkoutSdkRedirectAtom);
  const [otpLessOrderIdState, setOtpLessOrderIdState] =
    useState(otpLessOrderId);

  function onSuccessfulLogin(res: any) {
    setAccessTokenAtom(res.accessToken);
    setUserDetailsAtom(res.user);
    mixpanelEvents(res.user);

    navigate(`/checkout/batch/${checkoutSdkRedirectProps?.batchId}`, {
      replace: true,
      state: { ...checkoutSdkRedirectProps },
    });
  }

  const { mutate: _verifyOtplessMagicLink } = useMutation({
    mutationFn: verifyOtplessMagicLink,
    onSuccess: onSuccessfulLogin,
    onError: () => {
      errorToast("Error in verification");
    },
  });

  const { mutate: _verifyOtplessOtp } = useMutation({
    mutationFn: verifyOtplessOtp,
    onSuccess: onSuccessfulLogin,
    onError: () => {
      errorToast("Error in verification");
    },
  });

  const { mutate: _checkUserPhoneAndResendOtp } = useMutation({
    mutationFn: checkUserPhoneAndResendOtp,
    onError: (response) => {
      Mixpanel.track("login_otp_resend_error", {
        phone: phoneNumber,
      });
    },
    onSuccess: (response) => {
      Mixpanel.track("login_otp_resend_success", {
        phone: phoneNumber,
      });
    },
  });

  // useEffect(() => {
  //   let codeToSend = "";
  //   let phoneToSend = "";

  //   let codeValue = locationQueryParams.split("code=");
  //   if (codeValue.length && codeValue[1]) {
  //     codeToSend = codeValue[1].includes("&")
  //       ? codeValue[1].split("&") && codeValue[1].split("&")[0]
  //       : codeValue[1];
  //   }

  //   let phoneValue = locationQueryParams.split("phone=");
  //   if (phoneValue.length && phoneValue[1]) {
  //     phoneToSend = phoneValue[1].includes("&")
  //       ? phoneValue[1].split("&") && phoneValue[1].split("&")[0]
  //       : phoneValue[1];
  //   }

  //   if (codeToSend)
  //     _verifyOtplessMagicLink({ code: codeToSend, phone: phoneToSend });
  // }, [locationQueryParams]);

  const [otp, setOtp] = useState<string[]>([]);

  const buttonDisabled = () => {
    return otp.length != 4 || !otp.every((e) => e);
  };

  useEffect(() => {
    console.log(phoneNumber);
    console.log(otpLessOrderId);
    console.log(otp);
  }, [phoneNumber, otp, otpLessOrderId]);

  return (
    <Flex
      vertical
      style={{ minHeight: "88vh", marginTop: "24px", marginLeft: "24px" }}
      flex={1}
      justify="center"
    >
      <Flex vertical flex={1}>
        <span
          style={{ fontWeight: "bold", fontSize: "20px", marginBottom: "12px" }}
        >
          {" "}
          Enter one time password{" "}
        </span>
        <span style={{ paddingTop: "16px", paddingBottom: "16px" }}>
          <InputOTP
            inputType="numeric"
            wrapperStyle={{
              justifyContent: "flex-start",
            }}
            onChange={(v) => setOtp(v)}
            value={otp}
            variant="filled"
            length={4}
          ></InputOTP>
        </span>
        <span
          style={{
            paddingTop: "16px",
            fontSize: "12px",
            color: colors.secondary,
          }}
        >
          Didn't get the code yet?
        </span>
        <span
          onClick={() => {
            _checkUserPhoneAndResendOtp(otpLessOrderIdState as string);
          }}
          style={{
            paddingTop: "4px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          RESEND
        </span>

        <span style={{ marginTop: "30px" }}>
          <Button
            disabled={buttonDisabled()}
            onClick={() => {
              _verifyOtplessOtp({
                phone: phoneNumber as string,
                otp: otp.join(""),
                orderId: otpLessOrderIdState as string,
              });
            }}
            style={{
              flex: 1,
              backgroundColor: buttonDisabled() ? colors.secondary : "black",
              color: "white",
              height: "20%",
              width: "90%",

              // justifySelf: "center",
              paddingTop: "16px",
              paddingBottom: "16px",
              borderRadius: "5px",
              fontWeight: "bolder",
            }}
          >
            Confirm
          </Button>
        </span>
      </Flex>
    </Flex>
  );
};

export default VerifyMagicLink;
