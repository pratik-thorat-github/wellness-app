import { RouteComponentProps, useLocation, useNavigate } from "@reach/router";
import { Flex, Space } from "antd";
import HomeBanner from "./banner";
import ClassesNearYou from "./classes-near-you";
import CentersAroundYou from "./centers-around-you";
import ProfileBanner from "./profile-banner";
import { useMutation } from "@tanstack/react-query";
import { errorToast } from "../../components/Toast";
import { getAllActivities, getGymsByActivity } from "../../apis/gym/activities";
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

interface IHome extends RouteComponentProps {
  activitySelected?: string;
}

function MixpanelHomeInit(user: IUser) {
  console.log("Sending mixpanel home events");

  Mixpanel.identify(user?.phone as string);
  Mixpanel.people.set({
    $name: user?.name as string,
    $phone: user?.phone as string,
    $id: user?.id as number,
  });
  Mixpanel.track("open_home_page");
}

const Home: React.FC<IHome> = ({ activitySelected }) => {
  // useAuthRedirect();

  const navigate = useNavigate();

  let locationStates = useLocation().state;
  let activitySelectedFromFilters = locationStates
    ? (locationStates as any).activitySelectedFromFilters
    : null;

  activitySelected = activitySelectedFromFilters || activitySelected;
  const [activities, setActivities] = useState<string[]>([]);
  const [gymCardsData, setGymCardsData] = useState<IGymCard[]>([]);

  const [pluDetails, setPlusDetailsAtom] = useAtom(plusDetailsAtom);
  const [userDetails] = useAtom(userDetailsAtom);

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
    _getAllActivities();
    _getGymsByActivities(activitySelected);
    // _getPlusDetailsOfUser(userDetails?.phone as string);
  }, [activitySelected, navigate]);

  useEffect(() => {
    if (userDetails && !mixpanelSet.current) {
      MixpanelHomeInit(userDetails);
      mixpanelSet.current = true;
    }
  }, [userDetails]);

  if (!activities.length || !gymCardsData.length) return <Loader />;

  return (
    <Flex flex={1} vertical style={{}}>
      {!activitySelected || activitySelected == "all" ? (
        <div>
          <Space></Space>

          <Flex style={{ marginLeft: "16px" }} flex={1}>
            <ProfileBanner />
          </Flex>

          <Flex style={{ marginLeft: "16px" }} flex={3}>
            <HomeBanner />
          </Flex>

          <Flex style={{ marginLeft: "16px" }} flex={3}>
            <ClassesNearYou />
          </Flex>
        </div>
      ) : null}

      <Flex flex={3} style={{ marginLeft: "5%" }}>
        <CentersAroundYou
          activities={activities}
          activitySelected={activitySelected}
          gymCardsData={gymCardsData}
        />
      </Flex>
    </Flex>
  );
};

export default Home;
