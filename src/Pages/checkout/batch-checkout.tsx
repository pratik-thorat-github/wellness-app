import { RouteComponentProps, navigate, useLocation } from "@reach/router";
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
import { getActivityById } from "../../apis/gym/activities";
import { useMutation } from "@tanstack/react-query";
import { errorToast } from "../../components/Toast";
import { formatTimeIntToAmPm } from "../../utils/date";

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

const BatchCheckout: React.FC<IClassCheckout> = ({ gymData}) => {
  const [userDetails] = useAtom(userDetailsAtom);

  let locationStates = useLocation().state;
  let gymDataSentFromBatchSchedule = locationStates
    ? (locationStates as any).gymData
    : null;
  // let batchDetailsFromBatchSchedule = locationStates
  //   ? (locationStates as any).batchDetails
  //   : null;
  gymData = gymData || gymDataSentFromBatchSchedule;
  // batchDetails = batchDetails || batchDetailsFromBatchSchedule;

  const batchId= window.location.pathname.split('/')[3]
  const [selectedPlan, setSelectedPlan] = useState<ESelectedPlan>(
    ESelectedPlan.BATCH
  );
  const [batchDetails,setBatchDetails] = useState<IBatch>()
  const [totalAmount, setTotalAmount] = useState();

  const [plusDetails] = useAtom(plusDetailsAtom);
  const mixpanelSet = useRef(false);

  const [isClicked,setIsClicked]=useState<Boolean>(false)

  const gymId=batchDetails?.gymId


  useEffect(()=>{
    const shareButton = document.getElementById("share-button"); 
      shareButton?.addEventListener("click", () => { 
        if (navigator.share) {
          navigator.share({
              title: 'Web Share API Draft',
              text: 'Take a look at this spec!',
              url: 'https://wicg.github.io/web-share/#share-method',
            })
            .then(() => console.log('Successful share'))
            .catch((error) => console.log('Error sharing', error));
        } else {
          console.log('Share not supported on this browser, do it the old way.');
        }
      });
    shareButton?.removeEventListener('click',()=>{
      setIsClicked(false)
    })    

  },[isClicked])

  useEffect(() => {
    if (gymData && batchDetails) {
      // MixpanelBatchCheckoutInit(batchDetails, gymData);
      mixpanelSet.current = true;
    }
  }, [gymData, batchDetails]);

  const { mutate: _getActivityById } = useMutation({
    mutationFn: getActivityById,
    onSuccess: (result) => {
      console.log(result.batch);
      setBatchDetails(result.batch)
    },
    onError: (error) => {
      errorToast("Error in getting gym data");
    },
  });

  useEffect(() => {
    _getActivityById(batchId);
  }, []);

  const logoTsx = (
    <Flex flex={1}>
      {(batchDetails?.activity &&
        activityToSvgMap(batchDetails.activity.toLowerCase() as string)) ||
        null}
    </Flex>
  );

  const navigateToHome=()=>{
    navigate(`/gym/${gymId}/batch`)
  }


  const leftDivider=()=>{
    return(
      <svg xmlns="http://www.w3.org/2000/svg" width="111" height="2" viewBox="0 0 111 2" fill="none">
      <path d="M0 1H110.5" stroke="url(#paint0_linear_1369_5909)" stroke-opacity="0.7" stroke-width="0.8"/>
      <defs>
        <linearGradient id="paint0_linear_1369_5909" x1="0" y1="1.5" x2="110.5" y2="1.5" gradientUnits="userSpaceOnUse">
          <stop stop-color="white"/>
          <stop offset="1" stop-color="#9E9E9E"/>
        </linearGradient>
      </defs>
    </svg>
    )
  }
  const rightDivider=()=>{
    return(
      <svg xmlns="http://www.w3.org/2000/svg" width="111" height="2" viewBox="0 0 111 2" fill="none">
      <path d="M0.5 1H111" stroke="url(#paint0_linear_1369_5911)" stroke-opacity="0.7" stroke-width="0.8"/>
      <defs>
        <linearGradient id="paint0_linear_1369_5911" x1="0.5" y1="1.5" x2="111" y2="1.5" gradientUnits="userSpaceOnUse">
          <stop stop-color="#9E9E9E"/>
          <stop offset="1" stop-color="white"/>
        </linearGradient>
      </defs>
    </svg>
    )
  }

  const shareAndBack=()=>{
    return (
      <div className="shareAndBack">
        <span className="Btn" onClick={() => navigateToHome()}>
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
        <span
          className="Btn"
          id="share-button"
          onClick={() => setIsClicked(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M7.15833 11.2587L12.85 14.5753M12.8417 5.42533L7.15833 8.74199M17.5 4.16699C17.5 5.5477 16.3807 6.66699 15 6.66699C13.6193 6.66699 12.5 5.5477 12.5 4.16699C12.5 2.78628 13.6193 1.66699 15 1.66699C16.3807 1.66699 17.5 2.78628 17.5 4.16699ZM7.5 10.0003C7.5 11.381 6.38071 12.5003 5 12.5003C3.61929 12.5003 2.5 11.381 2.5 10.0003C2.5 8.61961 3.61929 7.50033 5 7.50033C6.38071 7.50033 7.5 8.61961 7.5 10.0003ZM17.5 15.8337C17.5 17.2144 16.3807 18.3337 15 18.3337C13.6193 18.3337 12.5 17.2144 12.5 15.8337C12.5 14.4529 13.6193 13.3337 15 13.3337C16.3807 13.3337 17.5 14.4529 17.5 15.8337Z"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
      </div>
    );

  }

  return (
    <Flex
      flex={1}
      vertical
      style={{
        backgroundColor: "#F8F8F8",
        minHeight: "100vh",
      }}
    >
      {shareAndBack()}
      <div style={{ clipPath: "ellipse(90% 100% at 50% 4%)" }}>
        <img
          width="360px"
          height="250px"
          className="activityImg"
          src="https://pbs.twimg.com/media/GPsDl8NXoAAWn6T?format=jpg&name=medium"
          alt="img"
        ></img>
      </div>
      <div style={{ padding: "0px 16px" }}>
        <div className="activityHeading">
          <span style={{ maxWidth: "220px" }}>
            {batchDetails?.activityName}
            {batchDetails?.trainer && ` with ${batchDetails?.trainer}`}
          </span>
        </div>
        <div className="activityDate">
          <span className="dot"></span>
          {formatTimeIntToAmPm(batchDetails?.startTime || 0)}
          <span className="dot"></span> {batchDetails?.DurationMin} min
        </div>
        <div className="activityLoc">Location</div>
        <div className="desc">
        {batchDetails?.aboutTheActivity && <div className="sectionAct">
             <div className="sectionActHeading">
              {leftDivider()}
              <span style={{ margin: "0px 12px" }}>ABOUT THE ACTIVITY</span>
              {rightDivider()}
            </div>
            <div className="sectionActItems">
              <ol type="1">
                {batchDetails?.aboutTheActivity?.split("\n").map((e) => {
                  return <li>{e}</li>;
                })}
              </ol>
            </div>
          </div>}
          {batchDetails?.whatToExpect &&<div className="sectionAct">
            <div className="sectionActHeading">
              {leftDivider()}
              <span style={{ margin: "0px 12px" }}>What TO Expect?</span>
              {rightDivider()}
            </div>
            <div className="sectionActItems">
              <ol type="1">
                {batchDetails?.whatToExpect?.split("\n").map((e) => {
                  return <li>{e}</li>;
                })}
              </ol>
            </div>          </div>}
            {batchDetails?.whatToBring &&<div className="sectionAct">
            <div className="sectionActHeading">
              {leftDivider()}
              <span style={{ margin: "0px 12px" }}>What TO Bring?</span>
              {rightDivider()}
            </div>
            <div className="sectionActItems">
              <ol type="1">
                {batchDetails?.whatToBring?.split("\n").map((e) => {
                  return <li>{e}</li>;
                })}
              </ol>
            </div>
          </div>}
          {batchDetails?.moreInfo &&<div className="sectionAct">
            <div className="sectionActHeading">
              {leftDivider()}
              <span style={{ margin: "0px 12px" }}>More info</span>
              {rightDivider()}
            </div>
            <div className="sectionActItems">
              <ol type="1">
                {batchDetails?.moreInfo?.split("\n").map((e) => {
                  return <li>{e}</li>;
                })}
              </ol>
            </div>
          </div>}
        </div>
      </div>
        <BookNowFooter
          checkoutType={ECheckoutType.BATCH}
          batchDetails={batchDetails}
          gymData={gymData}
          totalAmount={batchDetails?.price as number}
          userId={userDetails?.id as number}
          batchId={batchDetails?.batchId as number}
          plusMembershipDiscount={plusDetails?.plusDiscountPercent as number}
          plusMembershipPrice={plusDetails?.plusMemberShipPrice as number}
          plusMembershipOpted={selectedPlan === ESelectedPlan.BATCH_WITH_PLUS}
          batchPrice={batchDetails?.price as number}
        />
    </Flex>
  );
};

export default BatchCheckout;
