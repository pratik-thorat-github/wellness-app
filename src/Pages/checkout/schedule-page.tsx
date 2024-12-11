import { RouteComponentProps, navigate, useLocation } from "@reach/router";
import BatchInfoOnCheckout from "./batch-info";
import BatchPrice from "./batch-price";
import CheckoutPlusPrice from "./batch-checkout-plus-price";
import { useEffect, useRef } from "react";
import { ECheckoutType, ESelectedPlan } from "../../types/checkout";
import { plusDetailsAtom, userDetailsAtom } from "../../atoms/atom";
import { useAtom } from "jotai/react";
import activityToSvgMap from "../../images/class-images/activity-map";
import { Mixpanel } from "../../mixpanel/init";
import BookClassBanner from "../gym/book-class-banner";
import BatchSchedule from "../gym/batch-schedule";
import { Card, Flex } from "antd";
import ActivityTiles from "../../components/activity-tiles";
import {
  addDays,
  formatDate,
  formatTimeIntToAmPm,
  getDayOfWeek,
} from "../../utils/date";
import { RightOutlined } from "@ant-design/icons";
import { IBatch, IGymDetails } from "../../types/gyms";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  getGymBatchesForDate,
  getGymBatchesForSchedulePage,
} from "../../apis/gym/batches";
import { errorToast } from "../../components/Toast";

import { ReactComponent as NoBatchImage } from "../../images/gym/no-batch.svg";
import colors from "../../constants/colours";
import { Rs } from "../../constants/symbols";
import { toLetterCase } from "../../utils/string-operation";
import { getGymById, getPastAppBookings } from "../../apis/gym/activities";
import Loader from "../../components/Loader";
import { ReactComponent as Banner } from "../../images/home/banner.svg";
import "./style.css";
import { showDiscountText } from "../../utils/offers";
import MetaPixel from "../../components/meta-pixel";
import PullToRefresh from 'react-simple-pull-to-refresh';
import {handleRefresh} from '../../utils/refresh';
import SwipeHandler from "../../components/back-swipe-handler";


interface PastAppBookingObject {
  [key: string]: any; // Or use a more specific type
}

interface IClassCheckout extends RouteComponentProps {}

interface IClassCheckout {
}

const SchedulePage: React.FC<IClassCheckout> = ({}) => {
  const [selectedDate, setSelectedDate] = useState(
    formatDate(new Date()).isoDate
  );

  const location = useLocation();
  const data = JSON.stringify(location?.state);
  const [selectedActivity, setSelectedActivity] = useState("all");
  const [batches, setBatches] = useState<IBatch[]>([]);
  const activityFromURl = new URLSearchParams(window.location.search).get(
    "activity"
  );
  console.log(activityFromURl, "activityFromURl");

  const gymId = window.location.pathname.split("/")[2] || "";

  const [gym, setGym] = useState<IGymDetails | null>(null);
  const [userDetails] = useAtom(userDetailsAtom);
  const [isFromApp, setIsFromApp] = useState(false);
  const [pastAppBookings, setPastAppBookings] = useState({});

  useEffect(() => {
    setIsFromApp(window?.isFromApp || false);
    setPastAppBookings(window?.pastAppBookings || {});
  }, []);
  // const [pastAppBookings, setPastAppBookings] = useState<PastAppBookingObject>({});
  // const [isFromApp, setIsFromApp] = useState(false);
  // const [gotPastBookings, setGotPastAppBookings] = useState(false);

  // const { mutate: _getPastAppBookings } = useMutation({
  //   mutationFn: getPastAppBookings,
  //   onError: () => {
  //     errorToast("Error in getting past app bookings");
  //   },
  //   onSuccess: (result) => {
  //     console.log("past app bookings - ", result);
  //     setPastAppBookings(result.bookings);
  //   },
  // });

  // useEffect(() => {
  //   const userSource = window?.platformInfo?.platform  || 'web';
  //   const appFlag = userSource != 'web' ? true : false;
  //   setIsFromApp(appFlag);
  //   if(userDetails){
  //     const userId = JSON.parse(window.localStorage["zenfitx-user-details"]).id || null;
  //     _getPastAppBookings(userId)
  //     setGotPastAppBookings(true);
  //   }
  //   setGotPastAppBookings(true);
  // }, [])

  useEffect(() => {
    setSelectedActivity(activityFromURl ?? "all");
  }, [activityFromURl]);

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

  const { mutate: _getGymBatchesForDate } = useMutation({
    mutationFn: getGymBatchesForDate,
    onSuccess: (result) => {
      let batches = result.batches;

      setBatches(result.batches);
      if (!batches.length) errorToast("No batches found");
    },
    onError: (error) => {
      setBatches([]);
      errorToast("Error in getting batches");
    },
  });

  const { mutate: _getGymBatchesForSchedulePage } = useMutation({
    mutationFn: getGymBatchesForSchedulePage,
    onSuccess: (result) => {
      console.log(result.data);

      setBatches(Object.values(result.data).flat() as IBatch[]);
      if (!Object.values(result.data).flat().length)
        errorToast("No batches found");
    },
    onError: (error) => {
      setBatches([]);
      errorToast("Error in getting batches");
    },
  });

  useEffect(() => {
    Mixpanel.track("open_schedule_page", { gymId });
  }, []);

  useEffect(() => {
    _getGymById(gymId as string);
  }, [gymId]);

  useEffect(() => {
    if (gym?.gymId) {
      if (gym?.isOnlyWeekend) {
        _getGymBatchesForSchedulePage({
          id: gym.gymId,
          isWeekendOnly: true,
        });
      } else {
        _getGymBatchesForDate({
          id: gym?.gymId as number,
          date: selectedDate,
          activity: selectedActivity,
        });
      }
    }
  }, [gym]);

  const discountedPrice = (price: number, finalPrice: number, discountText: string, discountType: string) => (
    <span
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
      }}
    >
      <span
        style={{
          color: "#828081",
          fontSize: "8px",
          fontWeight: "400",
          textDecorationLine: "line-through",
        }}
      >
        {price}
      </span>
      <span
        style={{
          color: "#05070B",
          fontSize: "14px",
          fontWeight: "400",
          margin: "-4px 0px",
        }}
      >
        {Rs}
        {Math.floor(finalPrice)}
      </span>
      <span
        style={{
          color: "#828081",
          fontSize: "12px",
          fontWeight: "400",
        }}
      >
        per person
      </span>
      <span
        style={{
          color: "#008B4F",
          fontSize: "12px",
          fontWeight: "400",
        }}
        >
        {/* 50% off */}
        {discountType == "FLAT" ? discountText : ``}
      </span>
    </span>
  );

  if (!gym?.batches) return <Loader />;

  function generateBatchTile(gym: IGymDetails, batches: IBatch[]) {
    const batchTile = (batch: IBatch) => {
      const { maxDiscount, offerPercentage, discountType} = gym;
      const { price } = batch;
      let finalPrice = (price - maxDiscount) >  (price *  (100 - offerPercentage) / 100) ? (price - maxDiscount) : (price * (100 - offerPercentage) / 100)
      if(discountType == 'FLAT'){
        finalPrice = (price * (100 - offerPercentage) / 100);
      }
      const discountText = discountType == 'FLAT' ? `${offerPercentage}% off` : 
                           discountType == 'PERCENTAGE' ? 
                           `${offerPercentage}% off upto ${Rs}${maxDiscount} on 1st booking on App` : ``;
      return (
        <Card className={ gymIdArray.includes(gym.gymId) && batch.slots == batch.slotsBooked ? "disabledSoldOut": ""}
          style={{
            // paddingTop: "16px",
            // paddingBottom: "16px",
            // paddingLeft: "8px",
            // paddingRight: "16px",
            borderTopWidth: "0px",
            borderBottomWidth: "0px",
          }}
          onClick={() => {
            Mixpanel.track("clicked_batch_tile_on_schedule_page", {
              batchDetails: batch,
              gym,
            });
            navigate(`/checkout/batch/${batch.batchId}`, {
              state: {
                batchId: batch.batchId.toString(),
                batchDetails: batch,
                gym,
                isFromApp,
                pastAppBookings
              },
            });
          }}
        >
          <Flex flex='auto' vertical={true}>
            <Flex flex={1}>
              <Flex flex={1}>
                <span>
                  <span
                    style={{
                      backgroundColor: colors.border,
                      borderRadius: "4px",
                      padding: "3px",
                    }}
                  >
                    {batch.isDayPass
                      ? "All Day"
                      : formatTimeIntToAmPm(batch.startTime)}
                  </span>
                </span>
              </Flex>
              <Flex
                flex={6}
                style={{
                  // borderBottomWidth: "1px",
                  // borderBottomColor: colors.border,
                  // borderBottomStyle: "solid",
                  marginLeft: '16px',
                  paddingBottom: "8px",
                }}
              >
                <Flex flex={4} vertical >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {batch.venue && (
                      <span>{formatDate(batch.date)["date suffix"]}</span>
                    )}
                    <span style={{ fontWeight: "bold" }}>
                      {batch.activityName}
                    </span>
                    {batch.venue && <span>{batch.venue}</span>}
                  </div>
                  {batch.trainer ? (
                    <Flex flex={1}>By {batch.trainer}</Flex>
                  ) : null}
                  {!batch.isDayPass ? (
                    <Flex
                      style={{ color: colors.secondary, marginTop: "4px" }}
                      flex={1}
                    >
                      {batch.duration} min
                    </Flex>
                  ) : null}
                  {gym.gymId == 6 && batch.slots && batch.slotsBooked >= 0 && batch.slots != batch.slotsBooked ? (
                    <Flex 
                      style={{
                        color: "#C15700",
                        fontSize: "14px",
                        fontWeight: "400",
                        margin: "-4px 0px",
                        marginTop: "2px",
                        fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif"
                      }}
                      flex={1}
                    >
                      {batch.slots - batch.slotsBooked} spot(s) left out of {batch.slots}
                    </Flex>
                  )
                  :
                  gym.gymId == 6 && batch.slots && batch.slotsBooked >= 0 && batch.slots == batch.slotsBooked ? (
                    <Flex 
                      style={{
                        color: "#C15700",
                        fontSize: "14px",
                        fontWeight: "400",
                        margin: "-4px 0px",
                        marginTop: "2px",
                        fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif"
                      }}
                      flex={1}
                    >
                      Sold Out!
                    </Flex>
                  )
                  : null}
                </Flex>
                <Flex flex={2} vertical>
                  <Flex style={{
                    justifyContent: 'space-evenly'
                  }}>
                  {showDiscountText(gym, userDetails, isFromApp, pastAppBookings) ? (
                    discountedPrice(batch.price, finalPrice, discountText, discountType)
                  ) : (
                    <span style={{
                      marginRight: '-14px'
                    }}>
                      {Rs}
                      {batch.price}
                    </span>
                  )}
                  <span>
                    
                  </span>
                  <span>
                    <RightOutlined />
                  </span>
                  </Flex>
                  <Flex style={{
                    justifyContent: 'start'
                  }}>
                    <div style={{
                      fontSize: '12px',
                      color: '#828081'
                    }}>
                    {!showDiscountText(gym, userDetails, isFromApp, pastAppBookings) ?  `per person` : ``}
                    </div>
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
            <Flex style={{
                  justifyContent:'center',
                  color:'#1AAC6D', 
                  fontSize: showDiscountText(gym, userDetails, isFromApp, pastAppBookings) && (batch.discountType == 'PERCENTAGE') ? '11px' : '0px', 
                  borderBottomWidth: "1px",
                  borderBottomColor: colors.border,
                  borderBottomStyle: "solid"
                }}>
              {showDiscountText(gym, userDetails, isFromApp, pastAppBookings) && (batch.discountType == 'PERCENTAGE') ?
                `${offerPercentage}% off upto ${Rs}${maxDiscount} on 1st booking on App` : `.`
              }
            </Flex>
          </Flex>
        </Card>
      );
    };

    return (
      <Flex flex={1} vertical>
        {batches.map((batch) => {
          return <span key={batch.batchId}> {batchTile(batch)} </span>;
        })}
      </Flex>
    );
  }

  function noBatchComponent() {
    return (
      <Flex
        flex={1}
        align="center"
        justify="center"
        vertical
        style={{ marginTop: "48px", paddingBottom: "20px" }}
      >
        <NoBatchImage />
        <span style={{ margin: "8px 0px", fontSize: "14px" }}>
          Oops! No slot available.
        </span>
        <span style={{ fontSize: "14px" }}>
          Please select next available date.
        </span>
        {/* <span style={{ 
            display: 'flex',
            padding: '8px 16px',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '8px',
            background: '#000',
            color:'#fff',
            marginTop:'16px'
         }}>
          <span>View next available slot</span>
        </span> */}
      </Flex>
    );
  }

  const backBtn = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
      >
        <path
          d="M15.8337 9.99935H4.16699M4.16699 9.99935L10.0003 15.8327M4.16699 9.99935L10.0003 4.16602"
          stroke="white"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    );
  };

  const locationIcon = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
      >
        <path
          d="M6.99967 7.58268C7.96617 7.58268 8.74967 6.79918 8.74967 5.83268C8.74967 4.86618 7.96617 4.08268 6.99967 4.08268C6.03318 4.08268 5.24967 4.86618 5.24967 5.83268C5.24967 6.79918 6.03318 7.58268 6.99967 7.58268Z"
          stroke="white"
          stroke-width="0.7"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M6.99967 12.8327C9.33301 10.4993 11.6663 8.41001 11.6663 5.83268C11.6663 3.25535 9.577 1.16602 6.99967 1.16602C4.42235 1.16602 2.33301 3.25535 2.33301 5.83268C2.33301 8.41001 4.66634 10.4993 6.99967 12.8327Z"
          stroke="white"
          stroke-width="0.7"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    );
  };

  const handleSwipeRight = async () => {
    goToGymPage();
  }

  const goToGymPage = () => {
    navigate(`/gym/${gymId}`);
  };

  function generateDateTiles() {
    const style: React.CSSProperties = {
      cursor: "pointer",
      fontSize: "14px",
      width: "44px",
      height: "44px",
    };

    let selectedStyle: React.CSSProperties = {
      ...style,
      fontWeight: "bold",
      border: "1px solid rgba(255, 255, 255, 0.08)",
      borderRadius: "8px",
      background: "rgba(255, 255, 255, 0.16)",
    };

    const dateTile = (number: number, day: string, dateString: string) => (
      <Flex
        flex={1}
        vertical
        justify="center"
        align="center"
        style={selectedDate == dateString ? selectedStyle : style}
        onClick={() => {
          Mixpanel.track("clicked_date_on_schedule_page", {
            gymId: gym?.gymId,
            date: dateString,
            day: `${number}-${day}`,
          });
          setSelectedDate(dateString);
          _getGymBatchesForDate({
            id: gym?.gymId ?? 0,
            date: dateString,
            activity: selectedActivity,
          });
        }}
      >
        <span style={{ marginBottom: "4px" }}> {number} </span>
        <span> {day} </span>
      </Flex>
    );

    const weekDateAndDays = [];
    for (let days = 0; days < 7; days++) {
      let date = addDays(new Date(), days);
      let dateNumber = date.getDate();
      let day = toLetterCase(getDayOfWeek(date));
      let dateString = formatDate(date).isoDate;

      weekDateAndDays.push({
        number: dateNumber,
        day,
        dateString,
      });
    }

    return (
      <Flex
        flex={1}
        justify="space-evenly"
        style={{
          width: "100%",
          overflowX: "auto",
          scrollBehavior: "smooth",
          scrollbarWidth: "none",
        }}
      >
        {weekDateAndDays.map(({ number, day, dateString }) => (
          <span key={dateString}> {dateTile(number, day, dateString)} </span>
        ))}
      </Flex>
    );
  }

  return (
    <>
    <MetaPixel />
    {/* <SwipeHandler onSwipeRight={handleSwipeRight}> */}
    {/* <PullToRefresh onRefresh={handleRefresh}> */}
    <div>
      <div className="stickyWrap">
        {" "}
        <Banner />
        <div className="dateTileWrap">
          <div className="detailWrap">
            <div className="backBtn" onClick={() => goToGymPage()}>
              {backBtn()}
            </div>
            <div className="gymNames">{gym?.name}</div>
            {gym?.area && (
              <div className="locationName">
                <span>{locationIcon()}</span>
                <span>{gym?.area}</span>
              </div>
            )}
          </div>
          <div style={{ margin: "0px 8px 0px 24px" }}>
            {!gym?.isOnlyWeekend && generateDateTiles()}
          </div>
        </div>
      </div>

      {!gym?.isOnlyWeekend && (
        <Flex flex={1} style={{ paddingLeft: "24px" }}>
          <ActivityTiles
            activities={gym.activities}
            activitySelected={selectedActivity}
            onClickFunction={(activity: string) => {
              Mixpanel.track("clicked_activity_pill_gym", {
                gymId: gym.gymId,
                activity,
              });
              setSelectedActivity(activity);
              _getGymBatchesForDate({
                id: gym.gymId,
                date: selectedDate,
                activity: activity,
              });
            }}
            reposition
          />
        </Flex>
      )}

      <Flex flex={3} style={{ marginTop: "10px" }}>
        {batches && batches.length
          ? 
            generateBatchTile(gym, batches) 
          : noBatchComponent()}
      </Flex>
    </div>
    {/* </PullToRefresh> */}
    {/* </SwipeHandler> */}
    </>
  );
};

export default SchedulePage;
