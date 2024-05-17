import { Card, Flex } from "antd";

import { Link, NavigateFn, navigate, useNavigate } from "@reach/router";
import { IGymCard } from "../../types/gyms";
import { useEffect } from "react";
import ActivityTiles from "../../components/activity-tiles";
import { concatAndUpperCaseActivities } from "../../utils/activities";
import colors from "../../constants/colours";

import { ReactComponent as LocationLogo } from "../../images/home/location.svg";
import { Rs } from "../../constants/symbols";
import PlusOfferBanner from "../../components/plus-offer-banner";
import { useAtom } from "jotai/react";
import { plusDetailsAtom } from "../../atoms/atom";
import { IPlusDetails } from "../../types/user";
import { Mixpanel } from "../../mixpanel/init";
import GymPhotos from "../gym/gym-photos";

function getListOfCenters(
  gymCardsData: IGymCard[],
  plusDetails: IPlusDetails | null
) {
  const generateCards = gymCardsData.map((gymCard) => {
    return (
      <Flex
        onClick={() => {
          navigate(`/gym/${gymCard.gymId}`, {
            state: { gymId: gymCard.gymId.toString() },
          });
        }}
        key={gymCard.gymId}
        flex={1}
        vertical
        style={{
          borderRadius: "10px",
          borderColor: colors.border,
          borderStyle: "solid",
          marginBottom: "24px",
          height: "31%",
          width: "90vw",
        }}
      >
        <Flex
          flex={1}
          style={{
            borderWidth: "10px",
            borderRadius: "10px",
          }}
        >
          <GymPhotos gym={gymCard} showArray={false} />
        </Flex>

        <Flex
          flex={1}
          vertical
          style={{
            paddingLeft: "16px",
            paddingRight: "16px",
            marginBottom: "12px",
          }}
        >
          <Flex flex={1}>
            <Flex
              flex={2}
              align="left"
              vertical
              style={{
                width: "73%",
                paddingTop: "16px",
              }}
            >
              <Flex
                style={{
                  fontWeight: "bold",
                  fontSize: "16px",
                  marginBottom: "4px",
                }}
                flex={1}
              >
                {" "}
                {gymCard.name}{" "}
              </Flex>
              <Flex
                style={{
                  fontSize: "12px",
                  color: colors.secondary,
                  marginBottom: "4px",
                }}
                flex={1}
              >
                {" "}
                {concatAndUpperCaseActivities(
                  gymCard.activities.slice(0, 8)
                )}{" "}
              </Flex>
              <Flex
                style={{
                  fontSize: "12px",
                  color: colors.secondary,
                }}
                flex={1}
              >
                {/* <span style={{ marginRight: "4px" }}>
                  <LocationLogo />
                </span> */}
                <span>
                  {""} {gymCard.area}
                </span>
              </Flex>
            </Flex>
            <Flex
              flex={1}
              align="flex-start"
              style={{
                paddingTop: "16px",
              }}
            >
              <Flex
                flex={1}
                style={{
                  backgroundColor: colors.border,
                  borderRadius: "12px",
                  padding: "8px",
                }}
                vertical
                align="center"
                justify="flex-start"
              >
                <span style={{ fontSize: "16px" }}>
                  {Rs}
                  {gymCard.minPrice}
                </span>
                <span style={{ fontSize: "12px" }}>per class </span>
              </Flex>
            </Flex>
          </Flex>
        </Flex>

        {/* {!plusDetails?.isPlusMember ? (
          <Flex
            flex={1}
            style={{
              paddingLeft: "16px",
              paddingRight: "16px",
              marginBottom: "16px",
            }}
          >
            <PlusOfferBanner />
          </Flex>
        ) : null} */}
      </Flex>
    );
  });

  return (
    <Flex flex={1} vertical justify="space-evenly" style={{ width: "100%" }}>
      {generateCards}
    </Flex>
  );
}

interface ICentersNearYou {
  activities: string[];
  activitySelected?: string;
  gymCardsData: IGymCard[];
}

const CentersAroundYou: React.FC<ICentersNearYou> = ({
  activities,
  activitySelected,
  gymCardsData,
}) => {
  const navigate = useNavigate();
  const [plusDetails] = useAtom(plusDetailsAtom);

  const activityTilesOnClick = async (activity: string) => {
    if (navigate) {
      Mixpanel.track("clicked_activity_pill_home", {
        activity,
      });
      await navigate("/home", {
        state: {
          activitySelected: activity,
          activitySelectedFromFilters: activity,
        },
        replace: true,
      });
    }
  };

  return (
    <Flex
      flex={1}
      vertical
      style={{ marginTop: "16px" }}
      justify="space-evenly"
    >
      <Flex flex={2} style={{ fontWeight: "bold", paddingTop: "16px" }}>
        Explore fitness centres
      </Flex>

      <Flex flex={1}>
        <ActivityTiles
          activities={activities}
          activitySelected={(activitySelected as string) || "all"}
          onClickFunction={activityTilesOnClick}
        />
      </Flex>

      <Flex flex={4} style={{}}>
        {getListOfCenters(gymCardsData, plusDetails)}
      </Flex>
    </Flex>
  );
};

export default CentersAroundYou;
