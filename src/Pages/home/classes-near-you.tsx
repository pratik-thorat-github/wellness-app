import { Flex } from "antd";

import { ReactComponent as Yoga } from "../../images/class-images/yoga.svg";
import { ReactComponent as Pilate } from "../../images/class-images/pilate.svg";
import { ReactComponent as Swimming } from "../../images/class-images/swimming.svg";
import { ReactComponent as Badminton } from "../../images/class-images/badminton.svg";
import { ReactComponent as Hiit } from "../../images/class-images/hiit.svg";
import { ReactComponent as Strength } from "../../images/class-images/strength.svg";
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
      }}
    >
      <span>{classTile("yoga")}</span>
      <span>{classTile("pilate")}</span>
      <span> {classTile("swimming")} </span>
    </Flex>
  );
}

function createLowerFlexTiles() {
  let badmintonTile = (
    <Flex
      onClick={async () => {
        await navigateToHome("badminton");
      }}
      justify="center"
      align="center"
      vertical
    >
      <Flex>
        <Badminton />
      </Flex>
      <span> Badminton </span>
    </Flex>
  );

  let hiitTile = (
    <Flex
      onClick={async () => {
        await navigateToHome("hiit");
      }}
      justify="center"
      align="center"
      vertical
    >
      <Flex>
        <Hiit />
      </Flex>
      <span> Hiit </span>
    </Flex>
  );

  let strengthTile = (
    <Flex
      onClick={async () => {
        await navigateToHome("strength");
      }}
      justify="center"
      align="center"
      vertical
    >
      <Flex>
        <Strength />
      </Flex>
      <span> Strength </span>
    </Flex>
  );

  return (
    <Flex
      style={{
        flex: 1,
        justifyContent: "space-evenly",
        alignContent: "center",
      }}
    >
      <span>{classTile("badminton")}</span>
      <span>{classTile("hiit")}</span>
      <span> {classTile("strength")} </span>
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
          paddingBottom: "16px",
        }}
      >
        {" "}
        Book classes near you{" "}
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
