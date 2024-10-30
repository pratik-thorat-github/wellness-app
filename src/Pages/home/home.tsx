import { RouteComponentProps, useLocation, useNavigate } from "@reach/router";
import { Flex, Space } from "antd";
import HomeBanner from "./banner";
import ClassesNearYou from "./classes-near-you";
import CentersAroundYou from "./centers-around-you";
import ProfileBanner from "./profile-banner";
import { useMutation } from "@tanstack/react-query";
import { errorToast } from "../../components/Toast";
import {
  getAllActivities,
  getExclusiveGyms,
  getGymsByActivity,
} from "../../apis/gym/activities";
import { useEffect, useRef, useState } from "react";
import Loader from "../../components/Loader";
import { IGymCard } from "../../types/gyms";
import { getPlusDetailsOfUser } from "../../apis/user/plus";
import { useAtom } from "jotai/react";
import { plusDetailsAtom, userDetailsAtom } from "../../atoms/atom";
import IUser, { IPlusDetails } from "../../types/user";
import useAuthRedirect from "../auth/redirect-hook";
import { Mixpanel } from "../../mixpanel/init";
import LandingFooter from "../landing/Footer";
import { getUserDeatils } from "../../apis/user/userDetails";
import Onboarding from "./onboarding";
import MetaPixel from "../../components/meta-pixel";

interface IHome extends RouteComponentProps {
  activitySelected?: string;
  showClassesNearYou?: boolean;
}

function MixpanelHomeInit(user: IUser | null) {
  Mixpanel.identify(user?.phone as string);
  Mixpanel.people.set({
    $name: user?.name as string,
    $phone: user?.phone as string,
    $id: user?.id as number,
  });
  Mixpanel.track("open_home_page");
}

const Home: React.FC<IHome> = ({ activitySelected, showClassesNearYou }) => {
  // useAuthRedirect();

  const navigate = useNavigate();

  let locationStates = useLocation().state;
  let activitySelectedFromFilters = locationStates
    ? (locationStates as any).activitySelectedFromFilters
    : null;
  let showClassesNearYouFilters = locationStates
    ? (locationStates as any).showClassesNearYouFilters
    : null;

  activitySelected = activitySelectedFromFilters || activitySelected;
  showClassesNearYou = showClassesNearYouFilters == false ? false : true;
  const [activities, setActivities] = useState<string[]>([]);
  const [gymCardsData, setGymCardsData] = useState<IGymCard[]>([]);

  const [pluDetails, setPlusDetailsAtom] = useAtom(plusDetailsAtom);
  const [userDetails, setUserDetailsAtom] = useAtom(userDetailsAtom);
  const [onboarding, setOnboarding] = useState<boolean>(false);
  const showClassesNearYouRef = useRef(true);

  const mixpanelSet = useRef(false);

  const { mutate: _getAllActivities } = useMutation({
    mutationFn: getAllActivities,
    onError: () => {
      errorToast("Error in getting activities near you");
    },
    onSuccess: (result) => {
      console.log("activities - ", result);
      setActivities(result.activities);
    },
  });

  const { mutate: _getUserDeatils } = useMutation({
    mutationFn: getUserDeatils,
    onError: () => {
      errorToast("Error in getting user details");
    },
    onSuccess: (result) => {
      console.log("deatils - ", result);
      setUserDetailsAtom(result.user);
    },
  });

  const { mutate: _getGymsByActivities } = useMutation({
    mutationFn: getGymsByActivity,
    onError: () => {
      errorToast("Error in getting gyms by activity");
    },
    onSuccess: (result) => {
      console.log("gyms gotten - ", result);
      setGymCardsData(result.gyms);
    },
  });

  const { mutate: _getGymsByExclusive } = useMutation({
    mutationFn: getExclusiveGyms,
    onError: () => {
      errorToast("Error in getting gyms by activity");
    },
    onSuccess: (result) => {
      console.log("gyms gotten - ", result);
      setGymCardsData(result.gyms);
    },
  });

  // useEffect(()=>{
  //   const { mutate: _getGymsByActivities } = useMutation({
  //     mutationFn: getGymsByActivity,
  //     onError: () => {
  //       errorToast("Error in getting gyms by activity");
  //     },
  //     onSuccess: (result) => {
  //       console.log("gyms gotten - ", result);
  //       setGymCardsData(result.gyms);
  //     },
  //   });

  // },[activitySelected])

  const { mutate: _getPlusDetailsOfUser } = useMutation({
    mutationFn: getPlusDetailsOfUser,
    onSuccess: (data) => {
      console.log(data);
      setPlusDetailsAtom(data.plus as unknown as IPlusDetails);
    },
    onError: (error) => {
      errorToast("Error in getting plus details");
    },
  });

  useEffect(() => {
    if (onboarding) {
      setCookie("onboarding", "done", 1);
    }
  }, [onboarding]);

  useEffect(() => {
    const userDetails =
      window.localStorage["zenfitx-user-details"] &&
      JSON.parse(window.localStorage["zenfitx-user-details"]);

    if (!userDetails || (userDetails && userDetails.noOfBookings < 1)) {
      _getUserDeatils();
    }
    _getAllActivities();

    _getGymsByActivities(activitySelected);

    // _getPlusDetailsOfUser(userDetails?.phone as string);
  }, [activitySelected]);

  useEffect(() => {
    if (!mixpanelSet.current) {
      MixpanelHomeInit(userDetails);
      mixpanelSet.current = true;
    }
  }, [userDetails]);

  function setCookie(name: string, value: string, days: number) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000); // Convert days to milliseconds
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
  }

  // Set the 'onboarding' cookie to 'done' and expire it after 1 day
  const showOnBoarding = () => {
    return (
      !onboarding && !userDetails?.id && getCookie("onboarding") !== "done"
    );
  };

  function getCookie(name: string) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  // if (showOnBoarding()) return <Onboarding setOnboarding={setOnboarding} />;
  if (!activities.length || !gymCardsData.length) return <Loader />;

  return (
    <>
      <MetaPixel />
      <Flex flex={1} vertical style={{ overflowX: "hidden" }}>
        <div>
          <Space></Space>

          {/* {userDetails?.phone && <Flex flex={1}>
            <ProfileBanner />
          </Flex>} */}

          <Flex flex={3}>
            <HomeBanner />
          </Flex>

          {showClassesNearYou ? (
            <Flex style={{ marginLeft: "16px" }} flex={3}>
              <ClassesNearYou />
            </Flex>
          ) : null}
        </div>

        <Flex flex={3} style={{ margin: "0 5%" }}>
          <CentersAroundYou
            activities={activities}
            activitySelected={activitySelected}
            gymCardsData={gymCardsData}
            showClassesNearYou={showClassesNearYou}
          />
        </Flex>
      </Flex>
    </>
  );
};

export default Home;
