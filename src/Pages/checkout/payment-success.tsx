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
      navigate("/");
    }, 3000);
  }, []);

  return (
    <div
      style={{ display:"flex", flexDirection:'column', height:'100vh',justifyContent:'center',  padding: "24px" }}
      // justify="center"
      // align="center"
    >
      <div style={{display:"flex", justifyContent:'center', alignItems:'center'}}>
        <BatchInfoOnCheckout
          gymData={gymData as IGymDetails}
          batchDetails={batchDetails as IBatch}
          logoTsx={logoTsx}
        />
      </div>
      <div style={{display:"flex", justifyContent:'center', alignItems:'center',flexDirection:'column',gap:'100px'}}>
        <div
          style={{
            color: colors.secondary,
            margin: "16px 0px",
            fontSize: "12px",
            textAlign:'center'
          }}
        >
         You can find your booking in the profile section, please show the booking ID at the venue.
        </div>
        <div
          style={{ cursor: "pointer", fontSize:'12px',fontWeight:400,textAlign:"center" }}
          onClick={() => {
            navigate("/");
          }}
        >
          Redirect to home screen ...
        </div>
      </div>
    </div>
  );
};

export default BatchPaymentSuccess;
