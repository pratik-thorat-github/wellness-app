import { RouteComponentProps, useLocation } from "@reach/router";
import { Flex } from "antd";
import BatchInfoOnCheckout from "./batch-info";
import BatchPrice from "./batch-price";
import BatchCheckoutPlusPrice from "./batch-checkout-plus-price";
import BookNowFooter from "./book-now-footer";
import { IBatch, IGymDetails } from "../../types/gyms";
import { useEffect, useRef, useState } from "react";
import { ECheckoutType, ESelectedPlan } from "../../types/checkout";
import { plusDetailsAtom, userDetailsAtom } from "../../atoms/atom";
import { useAtom } from "jotai/react";
import activityToSvgMap from "../../images/class-images/activity-map";
import { Mixpanel } from "../../mixpanel/init";

interface IClassCheckout extends RouteComponentProps {
  batchDetails?: IBatch;
  gymData?: IGymDetails;
}

function MixpanelBatchCheckoutInit(batchDetails: IBatch, gymData: IGymDetails) {
  Mixpanel.track("open_batch_checkout_page", {
    ...batchDetails,
    ...gymData,
  });
}

const BatchCheckout: React.FC<IClassCheckout> = ({ gymData, batchDetails }) => {
  const [userDetails] = useAtom(userDetailsAtom);

  let locationStates = useLocation().state;
  let gymDataSentFromBatchSchedule = locationStates
    ? (locationStates as any).gymData
    : null;
  let batchDetailsFromBatchSchedule = locationStates
    ? (locationStates as any).batchDetails
    : null;
  gymData = gymData || gymDataSentFromBatchSchedule;
  batchDetails = batchDetails || batchDetailsFromBatchSchedule;

  const [totalAmount, setTotalAmount] = useState(batchDetails?.price);
  const [selectedPlan, setSelectedPlan] = useState<ESelectedPlan>(
    ESelectedPlan.BATCH
  );

  const [plusDetails] = useAtom(plusDetailsAtom);
  const mixpanelSet = useRef(false);

  useEffect(() => {
    if (gymData && batchDetails) {
      MixpanelBatchCheckoutInit(batchDetails, gymData);
      mixpanelSet.current = true;
    }
  }, [gymData, batchDetails]);

  const logoTsx = (
    <Flex flex={1}>
      {(batchDetails?.activity &&
        activityToSvgMap(batchDetails.activity.toLowerCase() as string)) ||
        null}
    </Flex>
  );

  return (
    <Flex
      flex={1}
      vertical
      style={{
        marginLeft: "8px",
        marginRight: "8px",
        backgroundColor: "#F8F8F8",
        minHeight: "88vh",
      }}
    >
      <Flex
        flex={1}
        style={{
          backgroundColor: "white",
          borderRadius: "10px",
          marginBottom: "10px",
        }}
      >
        <BatchInfoOnCheckout
          gymData={gymData as IGymDetails}
          batchDetails={batchDetails as IBatch}
          logoTsx={logoTsx}
        />
      </Flex>

      <Flex
        flex={1}
        vertical
        style={{
          backgroundColor: "white",
          borderBottomLeftRadius: "16px",
          borderBottomRightRadius: "16px",
          marginBottom: "12px",
        }}
      >
        <Flex flex={1}>
          <BatchPrice
            batchDetails={batchDetails as IBatch}
            setTotalAmount={setTotalAmount}
            selectedPlanState={[selectedPlan, setSelectedPlan]}
          />
        </Flex>
      </Flex>

      {/* {!plusDetails?.isPlusMember ? (
        <Flex
          flex={3}
          vertical
          style={{ backgroundColor: "white", borderRadius: "16px" }}
        >
          <Flex flex={1}>
            <BatchCheckoutPlusPrice
              batchDetails={batchDetails as IBatch}
              setTotalAmount={setTotalAmount}
              selectedPlanState={[selectedPlan, setSelectedPlan]}
              plusDetails={plusDetails}
            />
          </Flex>
        </Flex>
      ) : null} */}

      <Flex flex={1} align="flex-end">
        <BookNowFooter
          checkoutType={ECheckoutType.BATCH}
          batchDetails={batchDetails}
          gymData={gymData}
          totalAmount={totalAmount as number}
          userId={userDetails?.id as number}
          batchId={batchDetails?.batchId as number}
          plusMembershipDiscount={plusDetails?.plusDiscountPercent as number}
          plusMembershipPrice={plusDetails?.plusMemberShipPrice as number}
          plusMembershipOpted={selectedPlan === ESelectedPlan.BATCH_WITH_PLUS}
          batchPrice={batchDetails?.price as number}
        />
      </Flex>
    </Flex>
  );
};

export default BatchCheckout;
