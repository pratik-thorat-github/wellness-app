import { Flex } from "antd";

import { navigate } from "@reach/router";
import { Mixpanel } from "../../mixpanel/init";
import activityToSvgMap from "../../images/class-images/activity-map";
import { toLetterCase } from "../../utils/string-operation";

async function navigateToHome(activity: string) {
  Mixpanel.track("clicked_classes_tile_home", {
    activity,
  });
  return await navigate("/home", {
    state: {
      activitySelected: activity,
      activitySelectedFromFilters: activity,
    },
    replace: true,
  });
}

const classTile = (activity: string) => (
  <Flex
    onClick={async () => {
      await navigateToHome(activity);
    }}
    justify="center"
    align="center"
    vertical
  >
    <Flex>{activityToSvgMap(activity)}</Flex>
    <span style={{ marginTop: "4px" }}> {toLetterCase(activity)} </span>
  </Flex>
);

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
      <span>{classTile("badminton")}</span>
      <span>{classTile("swimming")}</span>
      <span> {classTile("boxing")} </span>
      <span> {classTile("hiit")} </span>
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
      <span>{classTile("strength")}</span>
      <span> {classTile("zumba")} </span>
      <span> {classTile("pt")} </span>
    </Flex>
  );
}

const ClassesNearYou: React.FC = () => {
  return (
    <Flex flex={1} vertical style={{}}>
      <Flex
        flex={1}
        align="left"
        style={{
          fontWeight: "bold",
          paddingTop: "16px",
          paddingBottom: "8px",
        }}
      >
        Popular activities{" "}
      </Flex>

      <Flex flex={3}>
        <Flex flex={1} vertical>
          <div
            style={{
              width: "90vw",
              overflow: "auto",
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
