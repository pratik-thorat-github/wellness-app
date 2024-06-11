import { RouteComponentProps, navigate, useLocation } from "@reach/router";
import BatchInfoOnCheckout from "./batch-info";
import BatchPrice from "./batch-price";
import CheckoutPlusPrice from "./batch-checkout-plus-price";
import BookNowFooter from "./book-now-footer";
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
import { getGymBatchesForDate } from "../../apis/gym/batches";
import { errorToast } from "../../components/Toast";

import { ReactComponent as NoBatchImage } from "../../images/gym/no-batch.svg";
import colors from "../../constants/colours";
import { Rs } from "../../constants/symbols";
import { toLetterCase } from "../../utils/string-operation";
import { getGymById } from "../../apis/gym/activities";
import Loader from "../../components/Loader";

interface IClassCheckout extends RouteComponentProps {}

interface IClassCheckout {
 
}

const Checkout: React.FC<IClassCheckout> = ({ }) => {
  const [selectedDate, setSelectedDate] = useState(
    formatDate(new Date()).isoDate
  );
  const [selectedActivity, setSelectedActivity] = useState("all");
  const [batches, setBatches] = useState<IBatch[]>([]);

  const gymId = window.location.pathname.split('/')[2] || ''




  const [gym, setGym] = useState<IGymDetails | null>(null);

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

  useEffect(() => {
    _getGymById(gymId as string);
  }, [gymId]);


  useEffect(()=>{
    setBatches(gym?.batches as IBatch[])
  },[gym])

  if (!gym?.batches) return <Loader />;





  function generateBatchTile(gym: IGymDetails, batches: IBatch[]) {
    const batchTile = (batch: IBatch) => {
      return (
        <Card
          style={{
            // paddingTop: "16px",
            // paddingBottom: "16px",
            // paddingLeft: "8px",
            paddingRight: "16px",
            borderTopWidth: "0px",
            borderBottomWidth: "0px",
          }}
          onClick={() => {
            navigate(`/checkout/batch/${batch.batchId}`, {
              state: {
                batchId: batch.batchId.toString(),
                batchDetails: batch,
                gym,
              },
            });
          }}
        >
          <Flex flex={1}>
            <Flex flex={2}>
              <span>
                <span
                  style={{
                    backgroundColor: colors.border,
                    borderRadius: "4px",
                    padding: "5px",
                  }}
                >
                  {batch.isDayPass
                    ? "All Day"
                    : formatTimeIntToAmPm(batch.startTime)}
                </span>
              </span>
            </Flex>
            <Flex
              flex={4}
              style={{
                borderBottomWidth: "1px",
                borderBottomColor: colors.border,
                borderBottomStyle: "solid",
  
                paddingBottom: "8px",
              }}
            >
              <Flex flex={2} vertical>
                <Flex flex={1} style={{ fontWeight: "bold" }}>
                  {batch.activityName}
                </Flex>
                {batch.trainer ? <Flex flex={1}>By {batch.trainer}</Flex> : null}
                {!batch.isDayPass ? (
                  <Flex
                    style={{ color: colors.secondary, marginTop: "4px" }}
                    flex={1}
                  >
                    {batch.duration} min
                  </Flex>
                ) : null}
              </Flex>
              <Flex flex={1}>
                <span>
                  {Rs}
                  {batch.price}{" "}
                </span>
                <span style={{ marginLeft: "auto" }}>
                  {" "}
                  <RightOutlined />{" "}
                </span>
              </Flex>
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
        <span style={{ marginTop: "8px" }}>No slots for today!</span>
        <span style={{ marginTop: "4px" }}>
          Try searching for slots in other dates
        </span>
      </Flex>
    );
  }

  function generateDateTiles() {
    const style: React.CSSProperties = {
      marginLeft: "11px",
      cursor: "pointer",
      fontSize: "14px",
    };

    let selectedStyle: React.CSSProperties = {
      ...style,
      borderBottomWidth: "2px",
      borderBottomStyle: "solid",
      fontWeight: "bold",
    };

    const dateTile = (number: number, day: string, dateString: string) => (
      <Flex
        flex={1}
        vertical
        justify="center"
        align="center"
        style={selectedDate == dateString ? selectedStyle : style}
        onClick={() => {
          Mixpanel.track("clicked_date_gym", {
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
        style={{
          borderBottomWidth: "1px",
          borderBottomStyle: "solid",
          borderBottomColor: colors.border,
        }}
        justify="space-evenly"
      >
        {weekDateAndDays.map(({ number, day, dateString }) => (
          <span key={dateString}> {dateTile(number, day, dateString)} </span>
        ))}
      </Flex>
    );
  }

  return (
    <Flex flex={1} vertical>
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
        />
      </Flex>

      <Flex flex={1}>{generateDateTiles()}</Flex>

      <Flex flex={3} style={{ marginTop: "10px" }}>
        {batches && batches.length
          ? generateBatchTile(gym, batches)
          : noBatchComponent()}
      </Flex>
    </Flex>
  );
};

export default Checkout;
