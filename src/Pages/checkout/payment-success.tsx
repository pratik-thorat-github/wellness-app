import { RouteComponentProps, navigate, useLocation } from "@reach/router";
import { Flex } from "antd";
import { IBatch, IGymDetails } from "../../types/gyms";
import BatchInfoOnCheckout from "./batch-info";
import { ReactComponent as PaymentSuccessLogo } from "../../images/checkout/payment-success.svg";
import colors from "../../constants/colours";
import { useEffect } from "react";

interface IPaymentSuccess extends RouteComponentProps {
  batchDetails?: IBatch;
  gymData?: IGymDetails;
}

const BatchPaymentSuccess: React.FC<IPaymentSuccess> = ({
  batchDetails,
  gymData,
}) => {
  let locationStates = useLocation().state;
  let gymDataSentFromBatchSchedule = locationStates
    ? (locationStates as any).gymData
    : null;
  let batchDetailsFromBatchSchedule = locationStates
    ? (locationStates as any).batchDetails
    : null;
  let checkoutTypeFromLocation = locationStates
    ? (locationStates as any).checkoutType
    : null;
  gymData = gymData || gymDataSentFromBatchSchedule;
  batchDetails = batchDetails || batchDetailsFromBatchSchedule;

  const logoTsx = (
    <Flex flex={1} vertical justify="center" align="center">
      <span>
        <PaymentSuccessLogo />
      </span>
      <span style={{ fontFamily: "cursive", marginBottom: "32px" }}>
        Booking Successful!
      </span>
    </Flex>
  );

  useEffect(() => {
    setTimeout(() => {
      navigate("/home");
    }, 3000);
  }, []);

  return (
    <Flex
      flex={1}
      vertical
      style={{ minHeight: "88vh", padding: "16px" }}
      // justify="center"
      // align="center"
    >
      <Flex flex={1} justify="center" align="center">
        <BatchInfoOnCheckout
          gymData={gymData as IGymDetails}
          batchDetails={batchDetails as IBatch}
          logoTsx={logoTsx}
        />
      </Flex>
      <Flex vertical flex={1} justify="flex-end" align="center">
        <Flex
          style={{
            color: colors.secondary,
            marginBottom: "24px",
            fontSize: "12px",
          }}
        >
          We’ve requested the centre for your booking, in-case of slot
          unavailability, We’ll refund your money!
        </Flex>
        <Flex
          style={{ cursor: "pointer", fontWeight: "bold" }}
          onClick={() => {
            navigate("/home");
          }}
        >
          Redirect to home ...
        </Flex>
      </Flex>
    </Flex>
  );
};

export default BatchPaymentSuccess;
