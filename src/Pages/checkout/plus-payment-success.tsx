import { RouteComponentProps, navigate } from "@reach/router";
import { Flex } from "antd";
import { ReactComponent as PaymentSuccessLogo } from "../../images/checkout/payment-success.svg";
import { useAtom } from "jotai/react";
import { plusDetailsAtom } from "../../atoms/atom";
import { useEffect } from "react";

interface IPlusPaymentSuccess extends RouteComponentProps {}

const PlusPaymentSuccess: React.FC<IPlusPaymentSuccess> = ({}) => {
  const [plusDetails] = useAtom(plusDetailsAtom);

  useEffect(() => {
    setTimeout(() => {
      navigate("/");
    }, 3000);
  }, []);

  const logoTsx = (
    <Flex flex={1} vertical justify="center" align="center">
      <span>
        <PaymentSuccessLogo />
      </span>
      <span style={{ fontFamily: "cursive", marginBottom: "32px" }}>
        Pass Bought Successfully
      </span>
    </Flex>
  );

  return (
    <Flex
      flex={1}
      vertical
      justify="center"
      align="center"
      style={{ minHeight: "88vh", padding: "16px" }}
    >
      <Flex flex={1} justify="center" align="center" vertical>
        <span>{logoTsx} </span>
        <span
          style={{
            fontSize: "18px",
          }}
        >
          {plusDetails?.plusDiscountPercent}% will be
        </span>
        <span
          style={{
            fontSize: "18px",
          }}
        >
          automatically applied on
        </span>
        <span
          style={{
            fontSize: "18px",
          }}
        >
          your next 5 classes bookings
        </span>
      </Flex>

      <Flex vertical flex={1} justify="flex-end" align="center">
        <Flex
          style={{ cursor: "pointer", fontWeight: "bold" }}
          onClick={() => {
            navigate("/");
          }}
        >
          <u> Book Classes</u>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default PlusPaymentSuccess;
