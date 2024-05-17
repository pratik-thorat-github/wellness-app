import { RouteComponentProps, navigate } from "@reach/router";
import { Flex } from "antd";
import UserDetails from "./user-details";
import NeedHelpBanner from "./need-help";
import colors from "../../constants/colours";
import PlusClassRemaining from "./plus-classes-remaining";
import PastClasses from "./past-classes";
import UpcomingClasses from "./upcoming-classes";
import { useAtom } from "jotai/react";
import { plusDetailsAtom } from "../../atoms/atom";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { getBookingOfUser } from "../../apis/user/bookings";
import { IBookings, IPlusDetails } from "../../types/user";
import { Mixpanel } from "../../mixpanel/init";
import LandingFooter from "../landing/Footer";

interface IProfile extends RouteComponentProps {}

function MixpanelProfileInit(noOfBookings: number, plusDetails: IPlusDetails) {
  Mixpanel.track("open_profile_page", {
    noOfBookings,
    ...plusDetails,
  });
}

const Profile: React.FC<IProfile> = () => {
  const [plusDetails] = useAtom(plusDetailsAtom);

  const [pastBookings, setPastBookings] = useState<IBookings[]>([]);
  const [upcomingBookings, setUpcomingBookings] = useState<IBookings[]>([]);

  const { mutate: _getBookingOfUser } = useMutation({
    mutationFn: getBookingOfUser,
    onSuccess: (result) => {
      setPastBookings(result.bookings.pastBookings);
      setUpcomingBookings(result.bookings.upcomingBookings);

      MixpanelProfileInit(
        result.bookings.pastBookings.length +
          result.bookings.upcomingBookings.length,
        plusDetails as IPlusDetails
      );
    },
    onError: () => {},
  });

  useEffect(() => {
    if (plusDetails) _getBookingOfUser();
  }, [navigate, plusDetails]);

  return (
    <Flex
      flex={1}
      vertical
      style={{ minHeight: "88vh", background: colors.screenBackground }}
    >
      <Flex flex={1} align="flex-start">
        <UserDetails />
      </Flex>

      <Flex flex={4} vertical>
        {/* {plusDetails?.isPlusMember ? (
          <Flex flex={1} align="flex-start">
            <PlusClassRemaining />
          </Flex>
        ) : null} */}

        {upcomingBookings.length ? (
          <Flex flex={1} align="center">
            <UpcomingClasses bookings={upcomingBookings} />
          </Flex>
        ) : null}

        {pastBookings.length ? (
          <Flex flex={1} align="center">
            <PastClasses bookings={pastBookings} />
          </Flex>
        ) : null}
      </Flex>

      <Flex flex={1} align="flex-end">
        <NeedHelpBanner />
      </Flex>

      <Flex flex={1} vertical align="flex-end">
        <LandingFooter />
      </Flex>

      {/* <Flex flex={1} vertical align="flex-end">
        <Flex flex={1}>
          <NeedHelpBanner />
        </Flex>
        <Flex flex={1}>
        <LandingFooter />
        </Flex>
      </Flex> */}
    </Flex>
  );
};

export default Profile;
