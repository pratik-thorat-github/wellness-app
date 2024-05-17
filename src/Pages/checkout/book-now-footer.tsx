import { Flex } from "antd";
import { Rs } from "../../constants/symbols";
import logo from "../../logo.svg";
import {
  ICreateRzpOrder,
  createCfOrder,
  createRzpOrder,
} from "../../apis/payments/payments";
import { navigate } from "@reach/router";
import { IBatch, IGymDetails } from "../../types/gyms";
import colors from "../../constants/colours";
import { ECheckoutType } from "../../types/checkout";
import { useAtom } from "jotai/react";
import { userDetailsAtom } from "../../atoms/atom";
import IUser from "../../types/user";
import { Mixpanel } from "../../mixpanel/init";
import { useEffect } from "react";

interface IBookNowFooter extends ICreateRzpOrder {
  batchDetails?: IBatch;
  gymData?: IGymDetails;
  checkoutType: ECheckoutType;
}

function loadScript(src: string) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

async function displayRazorpay(
  props: IBookNowFooter,
  userDetails: IUser | null
) {
  const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

  const orderResult = await createRzpOrder(props);

  if (!res) {
    alert("Razorpay SDK failed to load. Are you online?");
    return;
  }

  let description = `Checkout for batch - ${props.batchId}`;
  if (props.plusMembershipOpted)
    description += `, and plus membership for onePass`;

  const options = {
    key: "rzp_test_Gl4FFTP1YywZlb",
    amount: props.totalAmount * 100,
    currency: "INR",
    name: "Wellness One Pass",
    description,
    image: { logo },
    order_id: orderResult.orderId,
    handler: (response: any) => {
      if (response.razorpay_payment_id) {
        if (props.checkoutType == ECheckoutType.BATCH)
          navigate("/checkout/success", {
            state: {
              gymData: props.gymData,
              batchDetails: props.batchDetails,
            },
          });
        else if (props.checkoutType === ECheckoutType.PLUS) {
          navigate("/plus/success");
        }
      }
    },

    //todo user details
    prefill: {
      name: userDetails?.name as string,
      email: `${userDetails?.name as string}@example.com`,
      contact: userDetails?.phone as string,
    },
    theme: {
      color: "#61dafb",
    },
  };

  //@ts-ignore
  const paymentObject = new window.Razorpay(options);
  paymentObject.open();
}

async function displayCashfree(
  props: IBookNowFooter,
  userDetails: IUser | null
) {
  const res = await loadScript("https://sdk.cashfree.com/js/v3/cashfree.js");
  if (!res) {
    alert("CF SDK failed to load. Are you online?");
    return;
  }

  const orderResult = await createCfOrder(props);

  const options = {
    paymentSessionId: orderResult.paymentSessionId,
    redirectTarget: "_modal",
  };

  //@ts-ignore
  const cashfree = Cashfree({
    mode: "production",
  });
  cashfree.checkout(options).then((result: any) => {
    if (result.error) {
      // This will be true whenever user clicks on close icon inside the modal or any error happens during the payment
      console.log(
        "User has closed the popup or there is some payment error, Check for Payment Status"
      );
      console.log(result.error);
    }
    if (result.redirect) {
      // This will be true when the payment redirection page couldnt be opened in the same window
      // This is an exceptional case only when the page is opened inside an inAppBrowser
      // In this case the customer will be redirected to return url once payment is completed
      console.log("Payment will be redirected");
    }
    if (result.paymentDetails) {
      // This will be called whenever the payment is completed irrespective of transaction status
      console.log("Payment has been completed, Check for Payment Status");
      navigate("/plus/success");
    }
  });
}

function MixpanelBookNowFooterInit(
  props: IBookNowFooter,
  checkoutType: ECheckoutType
) {
  Mixpanel.track("open_payment_page", {
    ...props,
    checkoutType: checkoutType === ECheckoutType.BATCH ? "BATCH" : "PLUS",
  });
}

const BookNowFooter: React.FC<IBookNowFooter> = (props) => {
  const [userDetails] = useAtom(userDetailsAtom);

  return (
    <Flex
      flex={1}
      justify="stretch"
      style={{
        backgroundColor: "white",
        borderTopStyle: "solid",
        borderTopColor: colors.border,
        borderTopWidth: "1px",
        paddingTop: "16px",
        paddingBottom: "16px",
        paddingRight: "24px",
        paddingLeft: "24px",
      }}
    >
      <Flex flex={2} vertical justify="center" align="left">
        <span style={{ fontWeight: "bold", fontSize: "20px" }}>
          {Rs}
          {props.totalAmount}
        </span>
        <span style={{ color: colors.secondary, fontSize: "12px" }}>
          Total Amount
        </span>
      </Flex>

      <Flex
        flex={1}
        vertical
        justify="center"
        align="center"
        style={{
          color: "white",
          fontWeight: "bold",
          fontSize: "16px",
          backgroundColor: "#05070B",
          borderRadius: "10px",
        }}
        onClick={() => {
          MixpanelBookNowFooterInit(props, props.checkoutType);
          // displayRazorpay(props, userDetails);
          displayCashfree(props, userDetails);
        }}
      >
        <span>Book Now</span>
      </Flex>
    </Flex>
  );
};

export default BookNowFooter;
