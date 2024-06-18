import { Flex } from "antd";
import { Rs } from "../../constants/symbols";
import logo from "../../logo.svg";
import {
  ICreateRzpOrder,
  createCfOrder,
  createRzpOrder,
} from "../../apis/payments/payments";
import { navigate, useLocation } from "@reach/router";
import { EOfferType, IBatch, IGymDetails } from "../../types/gyms";
import colors from "../../constants/colours";
import { EBookNowComingFromPage, ECheckoutType } from "../../types/checkout";
import { useAtom } from "jotai/react";
import { checkoutSdkRedirectAtom, userDetailsAtom } from "../../atoms/atom";
import IUser from "../../types/user";
import { Mixpanel } from "../../mixpanel/init";
import { useEffect, useState } from "react";
import Loader from "../../components/Loader";
import { discountTxt } from "../../utils/offers";

export interface IBookNowFooter {
  batchDetails?: IBatch;
  totalAmount: number;
  gymData?: IGymDetails;
  checkoutType: ECheckoutType;
  comingFrom: EBookNowComingFromPage;
  batchId: number;
  totalGuests?: number;
  forceBookNowCta?:boolean
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

function createOrderPayload(props: IBookNowFooter, userDetails: IUser) {
  let payload: ICreateRzpOrder = {
    batchId: (props.batchDetails?.id || props.batchDetails?.batchId) as number,
    totalAmount: props.totalAmount,
    userId: userDetails.id as number,
    batchPrice: props.batchDetails?.price as number,

    offerPercentage: props.batchDetails?.offerPercentage as number,
    offerType: props.batchDetails?.offerType as EOfferType,
    noOfGuests: props.totalGuests as number,
  };

  return payload;
}

async function displayRazorpay(
  props: IBookNowFooter,
  userDetails: IUser | null,
  setLoading: (loading: boolean) => void
) {
  setLoading(true);
  const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

  let payload = createOrderPayload(props, userDetails as IUser);
  const orderResult = await createRzpOrder(payload);

  if (!res) {
    alert("Razorpay SDK failed to load. Are you online?");
    return;
  }

  let description = `Checkout for batch - ${props.batchId}`;
  // if (props.plusMembershipOpted)
  //   description += `, and plus membership for onePass`;

  const options = {
    key: process.env.REACT_APP_RZP_CLIENT_KEY,
    amount: props.totalAmount * 100,
    currency: "INR",
    name: "ZenFitX",
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

  setLoading(false);

  //@ts-ignore
  const paymentObject = new window.Razorpay(options);
  paymentObject.open();
}

async function displayCashfree(
  props: IBookNowFooter,
  userDetails: IUser | null,
  setLoading: (loading: boolean) => void
) {
  setLoading(true);
  const res = await loadScript("https://sdk.cashfree.com/js/v3/cashfree.js");
  if (!res) {
    alert("CF SDK failed to load. Are you online?");
    return;
  }

  let payload = createOrderPayload(props, userDetails as IUser);
  const orderResult = await createCfOrder(payload);

  const options = {
    paymentSessionId: orderResult.paymentSessionId,
    redirectTarget: "_modal",
  };

  //@ts-ignore
  const cashfree = Cashfree({
    mode: process.env.REACT_APP_CF_ENV,
  });

  setLoading(false);
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
  const [_, setCheckoutSdkRedirectAtom] = useAtom(checkoutSdkRedirectAtom);

  let locationStates = useLocation().state;
  console.log(locationStates);

  const [loading, setLoading] = useState(false);

  function processBookNowCta() {
    if(props.forceBookNowCta){
      Mixpanel.track("open_batch_checkout_booking", {
        batchId: props.batchId,
      });
      navigate(`/checkout/batch/${props.batchId}/booking`);
      return
    }
    if (!userDetails) {
      Mixpanel.track("open_batch_checkout_login_with_phone", {
        batchId: props.batchId,
      });
      setCheckoutSdkRedirectAtom(props);

      navigate("/login");
    } else if (
      props.comingFrom == EBookNowComingFromPage.BATCH_CHECKOUT_PAGE &&
      props.batchDetails?.guestsAllowed
    ) {
      Mixpanel.track("open_batch_checkout_booking", {
        batchId: props.batchId,
      });
      navigate(`/checkout/batch/${props.batchId}/booking`);
    } else {
      Mixpanel.track("open_batch_checkout_pay_now", {
        batchId: props.batchId,
        phone: userDetails.phone,
      });
      MixpanelBookNowFooterInit(props, props.checkoutType);
      displayRazorpay(props, userDetails, setLoading);
      // displayCashfree(props, userDetails, setLoading);
    }
  }

  useEffect(() => {
    setCheckoutSdkRedirectAtom(null);
  }, []);

  if (loading) return <Loader />;

  const showDiscount = () => {
    return !userDetails || (userDetails && userDetails.noOfBookings < 1);
  };


  const showCTA = () => {
    if (props.forceBookNowCta) return false;
    else {
      return !userDetails;
    }
  };

  const discountLine = () => <div className="discountLine">{discountTxt}pp</div>;

  return (
    <>
      <Flex
        flex={1}
        justify="stretch"
        style={{
          // maxHeight: "18vh",
          backgroundColor: "white",
          borderTopStyle: "solid",
          borderTopColor: colors.border,
          borderTopWidth: "1px",
          paddingTop: "12px",
          paddingBottom: "12px",
          position: "fixed",
          bottom: 0,
          width: "100%",
        }}
      >
        {showDiscount() && !showCTA() ? discountLine() : null}
        {showCTA() ? (
          <Flex
            flex={1}
            vertical
            style={{
              paddingRight: "24px",
              paddingLeft: "24px",
            }}
          >
            <Flex flex={1} style={{ fontWeight: "bolder", fontSize: "16px" }}>
              Almost There
            </Flex>
            <Flex
              flex={1}
              style={{
                fontSize: "12px",
                marginTop: "4px",
                color: colors.secondary,
              }}
            >
              Login quickly to finish the class booking
            </Flex>
            <Flex
              onClick={() => {
                processBookNowCta();
              }}
              flex={1}
              justify="center"
              align="center"
              style={{
                color: "white",
                fontWeight: "bold",
                fontSize: "16px",
                backgroundColor: "#05070B",
                borderRadius: "10px",
                marginTop: "16px",
                padding: "16px",
              }}
            >
              Proceed with Phone Number
            </Flex>
          </Flex>
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              paddingRight: "24px",
              paddingLeft: "24px",
            }}
          >
            <Flex flex={2} vertical justify="center" align="left">
              <span style={{ fontWeight: "bold", fontSize: "20px" }}>
                {Rs}
                {props.totalAmount}
              </span>
            </Flex>
            <div
              style={{
                color: "white",
                fontWeight: "700",
                fontSize: "16px",
                backgroundColor: "#05070B",
                borderRadius: "8px",
                padding: "12px 24px",
                display: "flex",
                alignItems: "center",
              }}
              onClick={() => {
                processBookNowCta();
              }}
            >
              <span>Book Now</span>
            </div>
          </div>
        )}
      </Flex>
    </>
  );
};

export default BookNowFooter;
