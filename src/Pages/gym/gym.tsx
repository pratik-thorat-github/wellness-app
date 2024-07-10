import { RouteComponentProps } from "@reach/router";
import { Flex } from "antd";
import GymPhotos from "./gym-photos";
import GymInfo from "./gym-info";
import BookClassBanner from "./book-class-banner";
import BatchSchedule from "./batch-schedule";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { getGymById } from "../../apis/gym/activities";
import { errorToast } from "../../components/Toast";
import Loader from "../../components/Loader";
import { IGymDetails } from "../../types/gyms";
import { Mixpanel } from "../../mixpanel/init";
import ShareMetada from "../../components/share-metadata";

interface IGYmPage extends RouteComponentProps {
  gymId?: string;
}

function MixpanelGymInit(gym: IGymDetails) {
  Mixpanel.track("open_gym_page", {
    gymName: gym.name,
    gymId: gym.gymId,
  });
}

const Gym: React.FC<IGYmPage> = ({ gymId }) => {
  const [gym, setGym] = useState<IGymDetails | null>(null);

  const { mutate: _getGymById } = useMutation({
    mutationFn: getGymById,
    onSuccess: (result) => {
      setGym(result.gym);
      MixpanelGymInit(result.gym);
    },
    onError: (error) => {
      errorToast("Error in getting gym data");
    },
  });

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    _getGymById(gymId as string);
  }, [gymId]);

  if (!gym) return <Loader />;

  return (
    <>
    < ShareMetada 
      title={"ZenFitX"}
      description={`Hey, I just discovered this awesome fitness studio on ZenfitX called ${gym?.name}. Check it out and let's plan this together! Plus, you can score sweet discounts on your first booking.😉`}
      url={window.location.href}
      image={gym.medias[0].url}
    />
    <div className="gymWrap">
      <Flex flex={1}>
        <GymPhotos gym={gym} />
      </Flex>

      <Flex flex={2} vertical justify="center">
      
          <GymInfo gymData={gym} />
       

        {/* <Flex flex={2}>
          <BookClassBanner />
        </Flex>

        <Flex flex={4}>
          <BatchSchedule gymData={gym} />
        </Flex> */}
      </Flex>
    </div>
    </>
  );
};

export default Gym;
