import { RouteComponentProps } from "@reach/router";
import { Button, Flex } from "antd";
import colors from "../../constants/colours";
import { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  addUser,
  checkUserPhoneAndSendOtplessMagicLink,
} from "../../apis/auth/login";
import useAuthRedirect from "./redirect-hook";
import { Mixpanel } from "../../mixpanel/init";

interface ILoginProps extends RouteComponentProps {}
const Login: React.FC<ILoginProps> = () => {
  const submitClicked = useRef(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [input, setInput] = useState({
    phone: "",
    name: "",
  });

  useAuthRedirect();

  function setValue(e: React.ChangeEvent<HTMLInputElement>) {
    var toSet = { ...input };
    //@ts-ignore
    toSet[e.target.name as keyof object] = e.target.value;

    setInput(toSet);
  }

  const { mutate: _checkUserPhoneAndSendOtplessMagicLink } = useMutation({
    mutationFn: checkUserPhoneAndSendOtplessMagicLink,
    onError: (response) => {
      setMagicLinkSent(false);
      submitClicked.current = false;

      Mixpanel.track("login_link_send_error", {
        phone: input.phone,
      });
    },
    onSuccess: () => {
      setMagicLinkSent(true);
      Mixpanel.track("login_link_send_success", {
        phone: input.phone,
      });
    },
  });

  const { mutate: _createUser } = useMutation({
    mutationFn: addUser,
    onError: (response) => {
      Mixpanel.track("user_creation_error", {
        phone: input.phone,
        name: input.name,
        error: response.message,
      });
    },
    onSuccess: () => {
      Mixpanel.track("user_creation_success", {
        phone: input.phone,
        name: input.name,
      });
    },
    onSettled: () => {
      _checkUserPhoneAndSendOtplessMagicLink(input.phone);
    },
  });

  useEffect(() => {}, []);

  function submitButton() {
    submitClicked.current = true;

    _createUser({ name: input.name, phone: input.phone });
  }

  const buttonDisabled = () => {
    if (submitClicked.current) return true;

    return Boolean(input.phone.length !== 10 || !input.name);
  };

  return (
    <Flex flex={1} style={{ padding: "24px" }} vertical justify="center">
      <Flex
        flex={1}
        vertical
        style={{ paddingTop: "12px", paddingBottom: "12px" }}
      >
        <span style={{ fontSize: "24px", fontWeight: "bold" }}>
          {" "}
          Welcome To Zenfit!{" "}
        </span>
        <span
          style={{
            fontSize: "14px",
            marginTop: "4px",
            color: colors.secondary,
          }}
        >
          {" "}
          Login with your mobile number{" "}
        </span>
      </Flex>

      <Flex
        flex={1}
        style={{ marginTop: "16px" }}
        vertical
        // align="center"
        justify="center"
      >
        <Flex
          flex={1}
          vertical
          style={{
            justifySelf: "stretch",
            alignSelf: "stretch",
          }}
        >
          <span>Enter Name</span>
          <span style={{ marginTop: "8px" }}>
            <input
              name="name"
              value={input.name}
              onChange={setValue}
              style={{
                width: "95%",
                borderRadius: "5px",
                height: "30px",
              }}
              type="text"
            />{" "}
          </span>
        </Flex>

        <Flex
          flex={1}
          vertical
          style={{
            justifySelf: "stretch",
            alignSelf: "stretch",
            marginTop: "16px",
          }}
        >
          <span>Mobile Number</span>
          <span style={{ marginTop: "8px" }}>
            <input
              style={{
                width: "95%",
                height: "30px",
                borderRadius: "5px",
              }}
              type="number"
              onChange={setValue}
              name="phone"
              value={input.phone}
            />{" "}
          </span>
        </Flex>
      </Flex>

      <Flex
        flex={1}
        vertical
        align="flex-start"
        justify="center"
        style={{ marginTop: "32px" }}
      >
        {magicLinkSent ? (
          <Flex
            flex={1}
            align="center"
            justify="center"
            style={{
              justifySelf: "center",
              alignSelf: "center",
              marginBottom: "4px",
              color: colors.secondary,
              fontSize: "12px",
            }}
          >
            We have sent a link on your whatsapp to verify that its you!
          </Flex>
        ) : null}

        <Button
          disabled={buttonDisabled()}
          onClick={() => {
            submitButton();
          }}
          style={{
            flex: 1,
            backgroundColor: buttonDisabled() ? colors.secondary : "black",
            color: "white",
            height: "20%",
            width: "100%",

            justifySelf: "center",
            paddingTop: "16px",
            paddingBottom: "16px",
            borderRadius: "5px",
            fontWeight: "bolder",
          }}
        >
          Get OTP
        </Button>
      </Flex>
    </Flex>
  );
};

export default Login;
