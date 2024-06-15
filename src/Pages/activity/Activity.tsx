import { RouteComponentProps, navigate, useLocation, useNavigate } from "@reach/router";
import React, { useEffect, useState } from 'react'
import { IGymCard } from "../../types/gyms";
import { useMutation } from "@tanstack/react-query";
import { getAllActivities, getExclusiveGyms, getGymsByActivity } from "../../apis/gym/activities";
import { errorToast } from "../../components/Toast";
import ClassesNearYou from "../home/classes-near-you";
import CentersAroundYou from "../home/centers-around-you";
import ActivityTiles from "../../components/activity-tiles";
import { useAtom } from "jotai";
import { userDetailsAtom } from "../../atoms/atom";
import { concatAndUpperCaseActivities } from "../../utils/activities";


interface IActivity extends RouteComponentProps {}

const Activity: React.FC<IActivity> = ({}) => {
const activity = window.location.pathname.split('/')[1]
const [activities, setActivities] = useState<string[]>([]);
const [gymCardsData, setGymCardsData] = useState<IGymCard[]>([]);
const [selectedActivity,setSelectedActivity]=useState<string>(activity);
const [userDetails] = useAtom(userDetailsAtom);
const discountTxt = "50% off on your first class booking";



const { mutate: _getAllActivities } = useMutation({
    mutationFn: getAllActivities,
    onError: () => {
      errorToast("Error in getting activities near you");
    },
    onSuccess: (result) => {
      setActivities(result.activities);
    },
  });


  const { mutate: _getGymsByActivities } = useMutation({
    mutationFn: getGymsByActivity,
    onError: () => {
      errorToast("Error in getting gyms by activity");
    },
    onSuccess: (result) => {
      setGymCardsData(result.gyms);
      if(!result.gyms.length)
      _getGymsByActivities('all')
    },
  });

  const { mutate: _getGymsByExclusive } = useMutation({
    mutationFn: getExclusiveGyms,
    onError: () => {
      errorToast("Error in getting gyms by activity");
    },
    onSuccess: (result) => {
      setGymCardsData(result.gyms);
    },
  });

useEffect(()=>{
    _getAllActivities();


},[])

useEffect(()=>{

    _getGymsByActivities(selectedActivity);
},[selectedActivity])

const exclusiveIcon = () => {
    return (
      <div className="specialWrap">
        <span className="specialTxt">Trending</span>

        <span className="specialIcon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="13"
            viewBox="0 0 12 13"
            fill="none"
          >
            <path
              opacity="0.8"
              d="M7.73192 1.88364L8.61499 3.40904L10.3478 3.73162L8.82239 4.61468L8.49981 6.34748L7.61674 4.82208L5.88394 4.4995L7.40934 3.61644L7.73192 1.88364Z"
              fill="#FFF7CC"
            />
            <path
              d="M3.88235 3.25586L4.93094 6.08962L7.76471 7.13821L4.93094 8.1868L3.88235 11.0206L2.83377 8.1868L0 7.13821L2.83377 6.08962L3.88235 3.25586Z"
              fill="#FFF7CC"
            />
          </svg>
        </span>
      </div>
    );
  };

  const discountCard = (price: number) => {
    return (
      <div className="dCard">
        <div className="dPrice">₹{price / 2}</div>
        <div className="sPrice slash">₹{price}</div>
        <div className="sPrice">onwards</div>
      </div>
    );
  };

  const locationIcon = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="17"
        height="16"
        viewBox="0 0 17 16"
        fill="none"
      >
        <path
          d="M8.49984 8.66732C9.60441 8.66732 10.4998 7.77189 10.4998 6.66732C10.4998 5.56275 9.60441 4.66732 8.49984 4.66732C7.39527 4.66732 6.49984 5.56275 6.49984 6.66732C6.49984 7.77189 7.39527 8.66732 8.49984 8.66732Z"
          stroke="#4F4F4F"
          stroke-width="1.33333"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M8.49984 14.6673C11.1665 12.0007 13.8332 9.61284 13.8332 6.66732C13.8332 3.7218 11.4454 1.33398 8.49984 1.33398C5.55432 1.33398 3.1665 3.7218 3.1665 6.66732C3.1665 9.61284 5.83317 12.0007 8.49984 14.6673Z"
          stroke="#4F4F4F"
          stroke-width="1.33333"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    );
  };

  const discountIcon = () => {
    return (
      <svg
        width="17"
        height="18"
        viewBox="0 0 17 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M13.2209 3.39881C13.3857 3.79723 13.7019 4.11392 14.1 4.27926L15.4962 4.85758C15.8946 5.02263 16.2112 5.33919 16.3762 5.73765C16.5413 6.1361 16.5413 6.58379 16.3762 6.98225L15.7983 8.37744C15.6332 8.77607 15.633 9.22422 15.7989 9.62265L16.3757 11.0174C16.4576 11.2148 16.4997 11.4263 16.4997 11.64C16.4998 11.8536 16.4577 12.0651 16.3759 12.2625C16.2942 12.4599 16.1743 12.6392 16.0233 12.7903C15.8722 12.9413 15.6928 13.0611 15.4954 13.1428L14.1003 13.7207C13.7019 13.8854 13.3852 14.2016 13.2199 14.5998L12.6416 15.996C12.4765 16.3945 12.16 16.711 11.7615 16.8761C11.3631 17.0411 10.9154 17.0411 10.517 16.8761L9.12183 16.2982C8.72338 16.1335 8.27586 16.1339 7.87766 16.2991L6.48151 16.8766C6.0833 17.0413 5.63601 17.0411 5.23789 16.8762C4.83978 16.7113 4.5234 16.3951 4.35825 15.9971L3.77978 14.6005C3.61504 14.2021 3.29884 13.8854 2.90068 13.72L1.50453 13.1417C1.10627 12.9767 0.789805 12.6604 0.624706 12.2621C0.459607 11.8639 0.459383 11.4164 0.624083 11.018L1.20197 9.62284C1.3666 9.22438 1.36627 8.77684 1.20104 8.37863L0.623978 6.98143C0.542162 6.78408 0.500034 6.57254 0.5 6.35891C0.499966 6.14527 0.542026 5.93372 0.623778 5.73635C0.70553 5.53897 0.825372 5.35964 0.976454 5.2086C1.12754 5.05756 1.3069 4.93777 1.50429 4.85608L2.89944 4.27817C3.2975 4.11358 3.61399 3.79776 3.77944 3.40004L4.35775 2.00385C4.52278 1.6054 4.83934 1.28883 5.23778 1.12378C5.63622 0.958739 6.08389 0.958739 6.48233 1.12378L7.87748 1.70169C8.27592 1.86633 8.72344 1.86599 9.12164 1.70076L10.5184 1.12468C10.9168 0.959728 11.3643 0.959762 11.7627 1.12477C12.1611 1.28978 12.4776 1.60626 12.6426 2.00461L13.2211 3.40122L13.2209 3.39881Z"
          stroke="#05C270"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    );
  };


const cardWidget = (gymCard: any) => {
    console.log(gymCard);
    const { medias, name, activities, area, minPrice, isExclusive } = gymCard;
    console.log(medias, "media");
    return (
      <div
        className="cardWrapper"
        onClick={() => {
          navigate(`/gym/${gymCard.gymId}`, {
            state: { gymId: gymCard.gymId.toString() },
          });
        }}
        key={gymCard.gymId}
      >
        <div className="activityImg1">
          {(isExclusive) && (
            <span className="sWrap">{exclusiveIcon()}</span>
          )}
          <img src={medias[0]} className="activityImg1Img" alt="activity pic" />
        </div>
        <div
          // className="activityDetailWrapper"
          className={
            userDetails && (userDetails?.noOfBookings as number) < 1
              ? "activityDetailWrapper2"
              : "activityDetailWrapper"
          }
        >
          <div className="activityDetail">
            <div className="name">
              {name} {discountCard(minPrice)}
            </div>
            <div className="activity">
              {concatAndUpperCaseActivities(activities.slice(0, 8))}
            </div>
            <div className="separator"></div>
            <div className="location">
              {locationIcon()}
              {area}
            </div>
          </div>

          {userDetails && (userDetails.noOfBookings as number) < 1 && (
            <div className="discount">
              <div>
                {discountIcon()}
                <span className="dTxt">{discountTxt}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const shareAndBack = () => {
    return (
      <div className="shareAndBack">
        <span className="Btn" onClick={() => navigate(-1)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M15.8327 10.0003H4.16602M4.16602 10.0003L9.99935 15.8337M4.16602 10.0003L9.99935 4.16699"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
      </div>
    );
  };


  return (
    <div>
      {" "}
      {shareAndBack()}
      <div style={{ padding: "24px 24px" }}>
        <ActivityTiles
          activities={activities}
          activitySelected={selectedActivity}
          onClickFunction={(activity: string) => {
            setSelectedActivity(activity);
          }}
          reposition
        />
        <div>
          {gymCardsData.map((gymCard) => {
            return cardWidget(gymCard);
          })}
        </div>
      </div>
    </div>
  ); 
};

export default Activity;
