import { RouteComponentProps, navigate } from "@reach/router";
import { useEffect, useRef } from "react";
import { Mixpanel } from "../../mixpanel/init";
import { Flex } from "antd";
import { formatDate, formatTimeIntToAmPm } from "../../utils/date";

import { EOfferType, IBatch, IGymDetails } from "../../types/gyms";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { errorToast } from "../../components/Toast";

import { Rs } from "../../constants/symbols";
import { toLetterCase } from "../../utils/string-operation";
import { getActivityById, getGymById } from "../../apis/gym/activities";
import Loader from "../../components/Loader";
import "./style.css";
import { useAtom } from "jotai";
import { userDetailsAtom } from "../../atoms/atom";
import BookNowFooter from "./book-now-footer";
import { EBookNowComingFromPage, ECheckoutType } from "../../types/checkout";
import { deductPercentage } from "../../utils/offers";

interface IClassCheckout extends RouteComponentProps {}

interface IClassCheckout {}

const BatchCheckoutBooking: React.FC<IClassCheckout> = ({}) => {
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalSavings, setTotalSavings] = useState(0);
  let [baseAmount, setBaseAmount] = useState(0);
  let [noOfGuests, setNoOfGuests] = useState(1);

  const [batchDetails, setBatchDetails] = useState<IBatch>();

  const batchId = window.location.pathname.split("/")[3];

  const [gym, setGym] = useState<IGymDetails | null>(null);
  const offerStrip = useRef("");

  const [userDetails] = useAtom(userDetailsAtom);

  const { mutate: _getActivityById } = useMutation({
    mutationFn: getActivityById,
    onSuccess: (result) => {
      console.log(result.batch);
      setBatchDetails(result.batch);
    },
    onError: (error) => {
      errorToast("Error in getting gym data");
    },
  });

  const { mutate: _getGymById } = useMutation({
    mutationFn: getGymById,
    onSuccess: (result) => {
      setGym(result.gym);
      //   MixpanelGymInit(result.gym);
    },
    onError: (error) => {
      errorToast("Error in getting gym data");
    },
  });

  useEffect(() => {
    _getActivityById(batchId);
  }, []);
  useEffect(() => {
    if (batchDetails?.gymId) {
      setBaseAmount(batchDetails.price);
      setTotalAmount(batchDetails.price);
      _getGymById(String(batchDetails.gymId));

      // offerStrip.current = "50% off on your 1st booking on ZenfitX";
      if (
        batchDetails.offerType == EOfferType.BATCH_WITH_GUESTS &&
        batchDetails.offerPercentage
      )
        offerStrip.current = `${batchDetails.offerPercentage} off on booking for ${batchDetails.minGuestsForOffer} people`;
      else if (userDetails && userDetails.noOfBookings < 1)
        offerStrip.current = "50% off on your 1st booking on ZenfitX";
    }
  }, [batchDetails]);

  if (!batchDetails || !gym) return <Loader />;

  //   A function that adds totalAmount

  function addGuests(increment = true) {
    let noOfGuestIncremented = increment ? noOfGuests + 1 : noOfGuests - 1;
    noOfGuests = noOfGuests || 1;
    let baseAmountAfterIncrement =
      (batchDetails?.price as number) * noOfGuestIncremented;

    setNoOfGuests(noOfGuestIncremented);
    setBaseAmount(baseAmountAfterIncrement);

    let [finalAmount, discount] = [baseAmountAfterIncrement, 0];
    if (
      batchDetails?.offerType == EOfferType.BATCH_WITH_GUESTS &&
      noOfGuestIncremented >= (batchDetails?.minGuestsForOffer || 0)
    )
      [finalAmount, discount] = deductPercentage(
        baseAmountAfterIncrement,
        batchDetails?.offerPercentage || 0
      );

    setTotalAmount(finalAmount);
    setTotalSavings(discount);
  }

  return (
    <Flex vertical>
      <span>
        {batchDetails.activityName}
        {batchDetails.trainer ? ` with ${batchDetails.trainer}` : null}
      </span>

      <span> {gym.name} </span>
      <span> {gym.area} </span>
      <span>
        {" "}
        {formatDate(batchDetails.date)["date suffix - Day"]} .
        {formatTimeIntToAmPm(batchDetails.startTime)}.{batchDetails.DurationMin}
        min
      </span>

      <span> Price - {batchDetails.price}</span>

      <span> Base amount - {baseAmount} </span>
      <span> Discount - {totalSavings} </span>
      <span> Final Amount - {totalAmount} </span>
      <span> No of guests - {noOfGuests} </span>

      <span>
        {" "}
        <button
          onClick={() => {
            addGuests();
          }}
        >
          Add guests
        </button>{" "}
      </span>

      {!batchDetails.guestsAllowed ? "Add guest component" : null}

      {offerStrip.current ? offerStrip.current : null}

      <Flex>
        <BookNowFooter
          batchDetails={batchDetails}
          gymData={gym}
          batchId={Number(batchId)}
          checkoutType={ECheckoutType.BATCH}
          totalAmount={totalAmount || batchDetails.price}
          comingFrom={EBookNowComingFromPage.BATCH_CHECKOUT_BOOKING_PAGE}
          totalGuests={noOfGuests}
        />
      </Flex>
    </Flex>
  );
};

export default BatchCheckoutBooking;
