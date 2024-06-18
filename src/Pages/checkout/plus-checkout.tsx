import { RouteComponentProps } from "@reach/router";
import { Flex } from "antd";
import BookNowFooter from "./book-now-footer";
import { EBookNowComingFromPage, ECheckoutType } from "../../types/checkout";
import { plusDetailsAtom, userDetailsAtom } from "../../atoms/atom";
import { useAtom } from "jotai/react";
import { ReactComponent as Membership } from "../../images/checkout/membership.svg";
import colors from "../../constants/colours";
import PlusMembershipPrice from "./plus-membership-price";
import { Mixpanel } from "../../mixpanel/init";
import { useEffect, useRef } from "react";
import { IPlusDetails } from "../../types/user";

interface IPlusCheckout extends RouteComponentProps {}

function MixpanelPlusCheckoutInit(plusDetails: IPlusDetails) {
  Mixpanel.track("open_plus_checkout_page", {
    ...plusDetails,
  });
}

const PlusCheckout: React.FC<IPlusCheckout> = ({}) => {
  const [plusDetails] = useAtom(plusDetailsAtom);
  const [userDetails] = useAtom(userDetailsAtom);

  const mixpanelSet = useRef(false);

  useEffect(() => {
    if (plusDetails && !mixpanelSet.current) {
      MixpanelPlusCheckoutInit(plusDetails);
      mixpanelSet.current = true;
    }
  }, [plusDetails]);

  if (plusDetails?.isPlusMember)
    return (
      <Flex
        flex={1}
        justify="center"
        align="center"
        style={{ minHeight: "88vh" }}
      >
        You are already a plus member!!
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
        // align="center"
        vertical
        style={{
          backgroundColor: "white",
          borderRadius: "16px",
          marginBottom: "16px",
        }}
      >
        <Flex
          flex={1}
          justify="center"
          align="center"
          vertical
          style={{ fontSize: "32px" }}
        >
          <span
            style={{
              //   marginBottom: "12px",
              backgroundColor: "#FEFCFA",
              borderStyle: "solid",
              borderColor: colors.border,
              borderRadius: "20px",
              paddingLeft: "5px",
              paddingRight: "5px",
              paddingTop: "5px",
            }}
          >
            <Membership />
          </span>
          <span>One Pass</span>
        </Flex>
      </Flex>

      <Flex
        flex={1}
        // align="center"
        vertical
        style={{ backgroundColor: "white", borderRadius: "16px" }}
      >
        <Flex
          flex={1}
          justify="center"
          align="center"
          style={{ marginLeft: "24px", marginRight: "24px" }}
        >
          <PlusMembershipPrice
            plusMembershipPrice={plusDetails?.plusMemberShipPrice as number}
          />
        </Flex>
      </Flex>

      <Flex flex={1} align="flex-end">
        <BookNowFooter
          batchId={0}
          checkoutType={ECheckoutType.PLUS}
          totalAmount={plusDetails?.plusMemberShipPrice as number}
          comingFrom={EBookNowComingFromPage.PLUS_CHECKOUT}
        />
      </Flex>
    </Flex>
  );
};

export default PlusCheckout;
