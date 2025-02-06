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
import { afterLoginRedirectAtom, userDetailsAtom } from "../../atoms/atom";
import IUser from "../../types/user";
import { Mixpanel } from "../../mixpanel/init";
import { useEffect, useState } from "react";
import Loader from "../../components/Loader";
import { calculateDiscountedPrice } from "../../utils/offers";
import { trackEvent } from "../../firebase/config";

interface RazorpayResponse {
  razorpay_payment_id?: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
  error?: {
    code: string;
    description: string;
    source: string;
    step: string;
    reason: string;
  };
}

interface PastAppBookingObject {
  [key: string]: any; // Or use a more specific type
}
export interface IBookNowFooter {
  batchDetails?: IBatch;
  totalAmount: number;
  gymData?: IGymDetails;
  checkoutType: ECheckoutType;
  comingFrom: EBookNowComingFromPage;
  batchId: number;
  totalGuests?: number;
  forceBookNowCta?: boolean;
  totalSavings?: number;
  isFromApp?: boolean;
  pastAppBookings?: PastAppBookingObject;
  disabled?: boolean;
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
    platform: props.isFromApp ? "APP" : "WEB",
    offerPercentage: (props.totalSavings as number)
      ? (props.batchDetails?.offerPercentage as number)
      : 0,
    offerType: props.batchDetails?.offerType as EOfferType,
    noOfGuests: props.totalGuests as number,
    username: userDetails.name,
    batchName: props?.batchDetails?.activityName || "",
    batchDate: props?.batchDetails?.date || "",
    batchTime: props?.batchDetails?.startTime || 0,
    participants: props?.batchDetails?.participants || [],
  };

  Mixpanel.track("pay_now_button_clicked_on_checkout_page", {
    ...payload,
  });

  return payload;
}

async function displayRazorpay(
  props: IBookNowFooter,
  userDetails: IUser | null,
  setLoading: (loading: boolean) => void,
) {
  setLoading(true);

  let payload = createOrderPayload(props, userDetails as IUser);
  let orderResult;

  try {
    orderResult = await createRzpOrder(payload);
  } catch (error) {
    console.log({ error });
    setLoading(false);
    return;
  }

  if (!orderResult?.orderId) {
    alert(`Could not place order!`);
    setLoading(false);
    return;
  }

  const options = {
    key: process.env.REACT_APP_RZP_CLIENT_KEY,
    amount: props.totalAmount * 100,
    currency: "INR",
    name: "ZenfitX",
    description: `Checkout for batch - ${props.batchId}`,
    image: { logo },
    order_id: orderResult.orderId,
    prefill: {
      name: userDetails?.name as string,
      email: `${userDetails?.name as string}@example.com`,
      contact: userDetails?.phone as string,
    },
    theme: {
      color: "#1a1a1a",
    },
    method: {
      upi: true,
    },
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
        trackEvent("slot_purchase", {
          activity_name: props.batchDetails?.activityName,
          total_amount: props.totalAmount,
          guests: props.totalGuests,
          booking_at: new Date().toISOString(),
        });
      }
    },
  };

  setLoading(false);

  // Web flow remains the same
  const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
  if (!res) {
    alert("Razorpay SDK failed to load. Are you online?");
    return;
  }
  //@ts-ignore
  const paymentObject = new window.Razorpay(options);
  paymentObject.open();
}

async function displayCashfree(
  props: IBookNowFooter,
  userDetails: IUser | null,
  setLoading: (loading: boolean) => void,
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
        "User has closed the popup or there is some payment error, Check for Payment Status",
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
  checkoutType: ECheckoutType,
) {
  Mixpanel.track("open_payment_page", {
    ...props,
    checkoutType: checkoutType === ECheckoutType.BATCH ? "BATCH" : "PLUS",
  });
}

const BookNowFooter: React.FC<IBookNowFooter> = (props) => {
  const [userDetails] = useAtom(userDetailsAtom);
  const [showDiscount, setShowDiscount] = useState(true);
  const [discountedAmount, setDiscountedAmount] = useState(props.totalAmount);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const BACKEND_URL = process.env.REACT_APP_BE_URL;

  const [loading, setLoading] = useState(false);
  const batchBookingUrl = `/checkout/batch/${props.batchId}/booking`;
  const maxDiscount = props.batchDetails?.maxDiscount || 0;
  const offerPercentage = props.batchDetails?.offerPercentage || 0;
  const discountType = props.batchDetails?.discountType || "";
  const price = props.batchDetails?.price || 0;
  let noOfGuests = 1;

  const shouldShowDiscountToUser = () => {
    if (!props.batchDetails) return false;
    if (props.batchDetails.discountType === "NONE") return false;
    if (!props.isFromApp) return false;
    if (props.pastAppBookings?.[props.batchDetails.gymId]) return false;
    if (props.comingFrom === EBookNowComingFromPage.BATCH_CHECKOUT_BOOKING_PAGE) return false;
    if (props.batchDetails.offerType === "BATCH_WITH_GUESTS") return false;
    
    return !userDetails || true;
  };

  const calculateFinalPrice = () => {
    if (!price || !noOfGuests) return 0;
    
    let finalPrice = price * noOfGuests;
    if (discountType === "FLAT") {
      finalPrice = (price * noOfGuests * (100 - offerPercentage)) / 100;
    } else {
      const percentageDiscount = (price * noOfGuests * offerPercentage) / 100;
      const discountAmount = Math.min(maxDiscount, percentageDiscount);
      finalPrice = price * noOfGuests - discountAmount;
    }
    return Math.floor(finalPrice);
  };

  useEffect(() => {
    setShowDiscount(shouldShowDiscountToUser());
  }, [
    props.batchDetails,
    props.isFromApp,
    props.pastAppBookings,
    props.comingFrom,
    userDetails
  ]);

  if (props.totalGuests && props.totalGuests > 1) {
    noOfGuests = props.totalGuests;
  }
  
  useEffect(() => {
    if (props.batchDetails) {
      // Get isFromApp and pastAppBookings directly from window
      const userSource = window?.platformInfo?.platform || 'web';
      const appFlag = userSource !== 'web';
      const storedBookings = window?.pastAppBookings || {};
  
      if (props.batchDetails?.discountType == "NONE") {
        setShowDiscount(false);
      } else if (!userDetails) {
        setShowDiscount(true);
      } else if (!appFlag) {  // Use appFlag instead of props.isFromApp
        setShowDiscount(false);
      } else if (storedBookings[props.batchDetails.gymId]) {  // Use storedBookings instead of props.pastAppBookings
        setShowDiscount(false);
      } else if (
        props.comingFrom == EBookNowComingFromPage.BATCH_CHECKOUT_BOOKING_PAGE
      ) {
        setShowDiscount(false);
      } else {
        setShowDiscount(true);
      }
    } else {
      setShowDiscount(false);
    }
    if (showCTA()) {
      setShowDiscount(false);
    }
  }, [props.batchDetails]);

  const discountText =
    props.gymData?.discountType == "FLAT"
      ? `FLAT ${offerPercentage}% off on 1st booking at this center`
      : props.gymData?.discountType == "PERCENTAGE"
        ? `${offerPercentage}% off upto ${Rs}${maxDiscount} on 1st booking at this center`
        : ``;

  async function processBookNowCta() {
    if (props.forceBookNowCta) {
      Mixpanel.track("open_batch_checkout_booking", {
        batchId: props.batchId,
      });
      navigate(batchBookingUrl, {
        state: {
          isFromApp: props.isFromApp,
          pastAppBookings: props.pastAppBookings,
        },
      });
      return;
    }
    if (!userDetails) {
      Mixpanel.track("open_batch_checkout_login_with_phone", {
        batchId: props.batchId,
      });
      navigate("/login", { replace: true });
    } else if (
      props.comingFrom == EBookNowComingFromPage.BATCH_CHECKOUT_PAGE &&
      props.batchDetails?.guestsAllowed
    ) {
      Mixpanel.track("open_batch_checkout_booking", {
        batchId: props.batchId,
      });
      navigate(batchBookingUrl, {
        state: {
          isFromApp: props.isFromApp,
          pastAppBookings: props.pastAppBookings,
        },
      });
    } else {
      Mixpanel.track("open_batch_checkout_pay_now", {
        batchId: props.batchId,
        phone: userDetails.phone,
      });

      const batchDetailsResp = await fetch(
        `${BACKEND_URL}/gyms/batch/byBatchId?batchId=${props.batchId}`,
      );

      const r = await batchDetailsResp?.json();
      console.log({ r });
      console.log(r.batch.slotsBooked, props.batchDetails?.slotsBooked);
      if (r?.batch?.slotsBooked + props.totalGuests > r.batch.slots) {
        if (r?.batch?.slotsBooked == r?.batch?.slots) {
          alert(
            `Sorry, all spots are booked for this slot. Please choose the next available slot.`,
          );
        } else
          alert(
            `Sorry, only ${
              r.batch.slots - r.batch.slotsBooked
            } spots are available for this slot. Please choose the next available slot!`,
          );
        window.location.reload();
      } else {
        if (
          window.platformInfo?.platform === "ios" ||
          window.platformInfo?.platform === "android"
        ) {
          //displayCashfree(props, userDetails, setLoading);
          await displayRazorpay(props, userDetails, setLoading)
        } else {
          await displayRazorpay(props, userDetails, setLoading);
        }
        // displayCashfree(props, userDetails, setLoading);
      }
    }
  }

  useEffect(() => {
    if (props.batchDetails) {
      console.log(props?.batchDetails);
      if (props.batchDetails?.discountType == "NONE") {
        setShowDiscount(false);
      } else if (!userDetails) {
        setShowDiscount(true);
      } else if (!props.isFromApp) {
        setShowDiscount(false);
      } else if (props.pastAppBookings?.[props.batchDetails.gymId]) {
        setShowDiscount(false);
      } else if (
        props.comingFrom == EBookNowComingFromPage.BATCH_CHECKOUT_BOOKING_PAGE
      ) {
        setShowDiscount(false);
      } else {
        setShowDiscount(true);
      }
    } else {
      setShowDiscount(false);
    }
    if (showCTA()) {
      setShowDiscount(false);
    }
  }, [props.batchDetails]);

  useEffect(() => {
    if (showDiscount && props.batchDetails) {
      const [newTotalAmount] = calculateDiscountedPrice(
        props.batchDetails?.price || 0,
        50,
      );
      let noOfGuests = 1;
      if (props.totalGuests) {
        noOfGuests = props.totalGuests;
      }
      let finalPrice =
        price * noOfGuests - maxDiscount >
        price * noOfGuests - (price * noOfGuests * offerPercentage) / 100
          ? price * noOfGuests - maxDiscount
          : price * noOfGuests - (price * noOfGuests * offerPercentage) / 100;
      if (discountType == "FLAT") {
        finalPrice =
          price * noOfGuests - (price * noOfGuests * offerPercentage) / 100;
      }
      finalPrice = Math.floor(finalPrice);
      setDiscountedAmount(finalPrice);
    }
  }, [showDiscount]);

  if (loading) return <Loader />;
  const showCTA = () => {
    if (props.forceBookNowCta) return false;
    else {
      return !userDetails;
    }
  };

  // const discountLine = () => <div className="discountLine">{discountTxt}</div>;
  const discountLine = () => <div className="discountLine">{discountText}</div>;

  const handleBookNowClick = async () => {
    if (props.disabled) {
      setErrorMessage(
        `Please select ${props.totalGuests} ${props.totalGuests === 1 ? "bike" : "bikes"} to continue`,
      );
      // Clear error message after 3 seconds
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }
    await processBookNowCta();
  };

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
        {showDiscount ? discountLine() : null}
        {errorMessage && (
          <div className="text-sm text-red-600 text-center absolute -top-8 left-0 right-0">
            {errorMessage}
          </div>
        )}
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
              Login quickly to finish the booking
            </Flex>
            <Flex
              onClick={async () => {
                await processBookNowCta();
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
            <Flex
              flex={2}
              vertical
              justify="center"
              align="left"
              className={discountedAmount ? "discountedAmountWrap" : ""}
            >
              {showDiscount && (
                <span>
                  {Rs}
                  {discountedAmount}
                </span>
              )}
              &nbsp;&nbsp;
              <span
                style={{
                  fontWeight: "bold",
                  fontSize: "20px",
                  textDecorationLine: showDiscount ? "line-through" : "",
                  marginBottom: showDiscount ? "3px" : "",
                }}
                className={showDiscount ? "discountedAmount" : ""}
              >
                {Rs}
                {props.totalAmount}
              </span>
            </Flex>
            <button
              id={
                props.comingFrom ===
                EBookNowComingFromPage.BATCH_CHECKOUT_BOOKING_PAGE
                  ? "conversion-book-now"
                  : "book-now"
              }
              className={`
                text-white font-bold text-base
                rounded-lg px-6 py-3
                flex items-center
                ${
                  props.disabled
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#05070B] cursor-pointer"
                }
              `}
              onClick={handleBookNowClick}
              disabled={props.disabled}
            >
              <span>Book Now</span>
            </button>
          </div>
        )}
      </Flex>
    </>
  );
};

export default BookNowFooter;
