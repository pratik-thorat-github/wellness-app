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
import { getGymBatchesForDate, getGymBatchesForSchedulePage } from "../../apis/gym/batches";
import { errorToast } from "../../components/Toast";

import { ReactComponent as NoBatchImage } from "../../images/gym/no-batch.svg";
import colors from "../../constants/colours";
import { Rs } from "../../constants/symbols";
import { toLetterCase } from "../../utils/string-operation";
import { getGymById } from "../../apis/gym/activities";
import Loader from "../../components/Loader";
import { ReactComponent as Banner } from "../../images/home/banner.svg";
import './style.css'

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

  const [batchesData , setBatchesData]=useState({})
  const [weekDateAndDays,setWeekDateAndDays]= useState<Array<{ number: number; day: string; dateString: string }>>([])
  const [dateLoading,setDateLoading]= useState<Boolean>(true)

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
    _getGymById(gymId as string);
  }, [gymId]);


//   useEffect(()=>{
//     setBatches(gym?.batches as IBatch[])
//   },[gym])

   const formatDatesObject = () => {
        const listOfDates = Object.keys(batchesData);
        const result: Array<{ number: number; day: string; dateString: string }> = [];

        listOfDates.forEach((e) => {
          let date = new Date(e);
          let dateNumber = date.getDate();
          let day = toLetterCase(getDayOfWeek(date));
          let dateString = formatDate(date).isoDate;
          result.push({
            number: dateNumber,
            day,
            dateString,
          });
        });
        setWeekDateAndDays(result)
    }

  const { mutate: _getGymBatchesForSchedulePage } = useMutation({
    mutationFn: getGymBatchesForSchedulePage,
    // onMutate:()=>{

    // },
    onSuccess: (result) => {
     console.log(result)

     setBatchesData(result.data)
     formatDatesObject()
     setDateLoading(false)
      if (!result.data.length) errorToast("No batches found");
    },
    onError: (error) => {
      setBatches([]);
      errorToast("Error in getting batches");
      setDateLoading(false)
    },
  });

  useEffect(()=>{
    _getGymBatchesForSchedulePage({id:1,isWeekendOnly:false})
  },[])

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
                  {batch.price}
                </span>
                <span style={{ marginLeft: "auto"}}>
                  <RightOutlined />
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
        <span style={{ margin: "8px 0px" ,fontSize:'14px'}}>Oops! No slots available</span>
        <span style={{ 
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
        </span>
      </Flex>
    );
  }

  const backBtn=()=>{
    return(
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
  <path d="M15.8337 9.99935H4.16699M4.16699 9.99935L10.0003 15.8327M4.16699 9.99935L10.0003 4.16602" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
    )
  }

  const locationIcon = ()=>{
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M6.99967 7.58268C7.96617 7.58268 8.74967 6.79918 8.74967 5.83268C8.74967 4.86618 7.96617 4.08268 6.99967 4.08268C6.03318 4.08268 5.24967 4.86618 5.24967 5.83268C5.24967 6.79918 6.03318 7.58268 6.99967 7.58268Z" stroke="white" stroke-width="0.7" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M6.99967 12.8327C9.33301 10.4993 11.6663 8.41001 11.6663 5.83268C11.6663 3.25535 9.577 1.16602 6.99967 1.16602C4.42235 1.16602 2.33301 3.25535 2.33301 5.83268C2.33301 8.41001 4.66634 10.4993 6.99967 12.8327Z" stroke="white" stroke-width="0.7" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    )
  }

  const goToGymPage=()=>{
    console.log(window.location)
    navigate(`/gym/${gymId}`)
  }

  function generateDateTiles() {
    const style: React.CSSProperties = {
      cursor: "pointer",
      fontSize: "14px",
      width:'44px',
      height:'44px'
    };

    let selectedStyle: React.CSSProperties = {
      ...style,
      fontWeight: "bold",
      borderRadius: '8px',
      background: 'rgba(255, 255, 255, 0.16)',     
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
        //   _getGymBatchesForDate({
        //     id: gym?.gymId ?? 0,
        //     date: dateString,
          setBatches(batchesData[dateString as keyof typeof batchesData])
        }}
      >
        <span style={{ marginBottom: "4px" }}> {number} </span>
        <span> {day} </span>
      </Flex>
    );

    console.log(weekDateAndDays,'weekDateAndDay')

    return (
      <Flex
        flex={1}
        justify="space-evenly"
      >
        {weekDateAndDays.map(({ number, day, dateString }) => (
          <span key={dateString}> {dateTile(number, day, dateString)} </span>
        ))}
      </Flex>
    );
  }

  return (
    <>
      <Banner />
     
      <div className="dateTileWrap">
      <div className="detailWrap">
        <div className="backBtn" onClick={()=>goToGymPage()}>
            {backBtn()}
        </div>
        <div className="gymNames">
          {gym?.name}
        </div>
        <div className="locationName">
        <span>{locationIcon()}</span><span>{gym?.area}</span>
        </div>
      </div>
        {generateDateTiles()}</div>
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

        <Flex flex={3} style={{ marginTop: "10px" }}>
          {batches && batches.length
            ? generateBatchTile(gym, batches)
            : noBatchComponent()}
        </Flex>
      </Flex>
    </>
  );
};

export default Checkout;
