import { Flex } from "antd";

import { navigate } from "@reach/router";
import { Mixpanel } from "../../mixpanel/init";
import activityToSvgMap from "../../images/class-images/activity-map";
import { toLetterCase } from "../../utils/string-operation";

async function navigateToHome(activity: string) {
  Mixpanel.track("clicked_classes_tile_home", {
    activity,
  });
  return await navigate("/", {
    state: {
      activitySelected: activity,
      activitySelectedFromFilters: activity,
      showClassesNearYouFilters: false,
    },
    replace: true,
  });
}

const classTile = (activity: string) => (
  <Flex
    onClick={async () => {
      await navigate(`/${activity}`);
    }}
    justify="center"
    align="center"
    vertical
  >
    <Flex>{activityToSvgMap(activity)}</Flex>
    {/* <span style={{ marginTop: "4px" }}> {toLetterCase(activity)} </span> */}
  </Flex>
);

const trendingTile = () => {
  return (
    <div
      className="trendingBox"
      onClick={async () => {
        await navigate(`/trending`);
      }}
    >
      <div className="trendingWrapper">
        <span className="trending">Trending</span>
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="17"
            viewBox="0 0 20 17"
            fill="none"
          >
            <path
              d="M14 5L15.6205 9.37946L20 11L15.6205 12.6205L14 17L12.3795 12.6205L8 11L12.3795 9.37946L14 5Z"
              fill="#FFF7CC"
            />
            <path
              opacity="0.8"
              d="M3.5 0L4.44532 2.55468L7 3.5L4.44532 4.44532L3.5 7L2.55468 4.44532L0 3.5L2.55468 2.55468L3.5 0Z"
              fill="#FFF7CC"
            />
          </svg>
        </span>
      </div>
      <div className="zBox">on Zenfitx</div>
    </div>
  );
};

function createUpperFlexTiles() {
  return (
    <Flex
      style={{
        flex: 1,
        justifyContent: "space-around",
        marginBottom: "16px",
        gap: "8px",
      }}
    >
      <span>{trendingTile()}</span>
      <span> {classTile("boxing")} </span>
      <span>{classTile("badminton")}</span>
      <span>{classTile("strength")}</span>
      <span>{classTile("swimming")}</span>
      <span> {classTile("pt")} </span>
      <span> {classTile("dance")} </span>
    </Flex>
  );
}

function createLowerFlexTiles() {
  return (
    <Flex
      style={{
        flex: 1,
        justifyContent: "space-evenly",
        alignContent: "center",
        gap: "8px",
      }}
    >
      <span>{classTile("yoga")}</span>
      <span>{classTile("pickleball")}</span>
      <span> {classTile("gym")} </span>
      <span> {classTile("zumba")} </span>
      <span> {classTile("football")} </span>
      <span> {classTile("hiit")} </span>
      <span> {classTile("cricket")} </span>
      {/* <span> {classTile("gymdaypass")} </span> */}

    </Flex>
  );
}

const ClassesNearYou: React.FC = () => {
  return (
    <Flex flex={1} vertical style={{}}>
      <Flex flex={1} align="left" className="sectionHeading">
        <span style={{ marginRight: "12px" }}>Popular activities</span>
        <span className="separator" style={{ marginRight: "16px" }}></span>
      </Flex>

      <Flex flex={3}>
        <Flex flex={1} vertical>
          <div
            style={{
              width: "100vw",
              overflow: "auto",
              scrollbarWidth: "none",
              scrollBehavior: "smooth",
            }}
          >
            <Flex flex={1} wrap="nowrap">
              {createUpperFlexTiles()}
            </Flex>
            <Flex flex={1} wrap="nowrap">
              {createLowerFlexTiles()}
            </Flex>
          </div>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ClassesNearYou;
