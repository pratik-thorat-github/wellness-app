import { RouteComponentProps, navigate, useLocation } from "@reach/router";
import { Button, Flex, Input } from "antd";
import { useMutation } from "@tanstack/react-query";
import {
  checkUserPhoneAndResendOtp,
  verifyOtplessMagicLink,
  verifyOtplessOtp,
} from "../../apis/auth/login";
import { errorToast } from "../../components/Toast";
import { useEffect, useRef, useState } from "react";
import OtpInput from "react-otp-input";

import "./style.css";

import {
  accessTokenAtom,
  afterLoginRedirectAtom,
  userDetailsAtom,
} from "../../atoms/atom";
import { useAtom } from "jotai/react";
import { Mixpanel } from "../../mixpanel/init";
import colors from "../../constants/colours";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { setUserProfile, trackEvent } from "../../firebase/config";

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
  const [afterLoginRedirectProps] = useAtom(afterLoginRedirectAtom);
  const [otpLessOrderIdState, setOtpLessOrderIdState] =
    useState(otpLessOrderId);

  function setUserAnalytics(user: any) {
    // Set Mixpanel user properties
    Mixpanel.identify(user.phone);
    Mixpanel.track("Successful login", {
      phone: user.phone,
    });
    Mixpanel.people.set({
      $name: user.name,
      $phone: user.phone,
    });

    // Set Firebase Analytics user properties
    setUserProfile({
      user_id: user.phone, // Using phone as user_id since it's unique
      phone_number: user.phone,
      name: user.name,
    });

    // Track login event in Firebase
    trackEvent("user_login", {
      method: "otp",
      user_id: user.phone,
      last_login: new Date().toISOString(),
    });
  }

  function onSuccessfulLogin(res: any) {
    setAccessTokenAtom(res.accessToken);
    const userWithBookings = {
      ...res.user,
      noOfBookings: res.user.noOfBookings ?? 0,
    };
    setUserDetailsAtom(userWithBookings);

    // Set user properties in both Mixpanel and Firebase
    setUserAnalytics(userWithBookings);

    navigate(afterLoginRedirectProps?.afterLoginUrl || "/", {
      replace: true,
      state: { ...afterLoginRedirectProps },
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
      wrongOtp.current = true;
      errorToast("Error in verification");
    },
  });

  const { mutate: _checkUserPhoneAndResendOtp } = useMutation({
    mutationFn: checkUserPhoneAndResendOtp,
    onError: (response) => {
      Mixpanel.track("login_otp_resend_error", {
        phone: phoneNumber,
      });

      resend.current = -1;
    },
    onSuccess: (response) => {
      Mixpanel.track("login_otp_resend_success", {
        phone: phoneNumber,
      });

      resend.current = 1;
    },
  });

  const [otp, setOtp] = useState("");
  const wrongOtp = useRef(false);

  // -1 = resend failed, 0 = not resent, 1 = successfully resent
  const resend = useRef(0);

  const buttonDisabled = () => {
    // return otp.length != 4 || !otp.every((e) => e);
    return otp.length != 4;
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
        {/* Header line */}
        <span
          style={{ fontWeight: "bold", fontSize: "20px", marginBottom: "12px" }}
        >
          {" "}
          Enter one time password{" "}
        </span>
        {/* OTP Input */}
        <span style={{ paddingTop: "16px", paddingBottom: "16px" }}>
          <OtpInput
            value={otp}
            onChange={setOtp}
            numInputs={4}
            renderSeparator={<span>{`    `}</span>}
            renderInput={(props: any) => <input {...props} />}
            inputType="number"
            inputStyle={{
              height: "48px",
              width: "32px",
              marginLeft: "4px",
              background: colors.screenBackground,
              borderStyle: "none",
              borderBottomStyle: "solid",
              borderBottomColor: "black",
              borderRadius: "4px",
              fontWeight: "bold",
              fontSize: "18px",
            }}
          />
        </span>
        {/* Wrong OTP */}
        {wrongOtp.current ? (
          <span style={{ color: "red", fontSize: "12px" }}>
            <ExclamationCircleOutlined /> Incorrect OTP, please re-enter
          </span>
        ) : null}

        {/* Didnt get code */}
        <span
          style={{
            paddingTop: "16px",
            fontSize: "12px",
            color: colors.secondary,
          }}
        >
          Didn't get the code yet?
        </span>
        {/* Resend */}
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
        {/* Wrong OTP */}
        {resend.current ? (
          resend.current < 0 ? (
            <span style={{ color: "red", fontSize: "12px" }}>
              <ExclamationCircleOutlined /> Re-sending failed, please try after
              a few seconds
            </span>
          ) : (
            <span style={{ color: "green", fontSize: "12px" }}>
              OTP Resent successfully
            </span>
          )
        ) : null}
        {/* Confirm */}
        <span style={{ marginTop: "30px" }}>
          <Button
            disabled={buttonDisabled()}
            onClick={() => {
              _verifyOtplessOtp({
                phone: phoneNumber as string,
                // otp: otp.join(""),
                otp,
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
