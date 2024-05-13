import { Flex } from "antd";

import { ReactComponent as Yoga } from "../../images/class-images/yoga.svg";
import { ReactComponent as Pilate } from "../../images/class-images/pilate.svg";
import { ReactComponent as Swimming } from "../../images/class-images/swimming.svg";
import { ReactComponent as Badminton } from "../../images/class-images/badminton.svg";
import { ReactComponent as Hiit } from "../../images/class-images/hiit.svg";
import { ReactComponent as Strength } from "../../images/class-images/strength.svg";
import { navigate } from "@reach/router";
import { Mixpanel } from "../../mixpanel/init";

async function navigateToHome(activity: string) {
  Mixpanel.track("clicked_classes_tile_home", {
    activity,
  });
  return await navigate("/", {
    state: {
      activitySelected: "yoga",
      activitySelectedFromFilters: "yoga",
    },
    replace: true,
  });
}

function createUpperFlexTiles() {
  let yogaTile = (
    <Flex
      onClick={async () => {
        await navigateToHome("yoga");
      }}
      justify="center"
      align="center"
      vertical
    >
      <Flex>
        <Yoga />
      </Flex>
      <span> Yoga </span>
    </Flex>
  );

  let pilateTile = (
    <Flex
      onClick={async () => {
        await navigateToHome("pilate");
      }}
      justify="center"
      align="center"
      vertical
    >
      <Flex>
        <Pilate />
      </Flex>
      <span> Pilate </span>
    </Flex>
  );

  let swimmingTile = (
    <Flex
      onClick={async () => {
        await navigateToHome("pilate");
      }}
      justify="center"
      align="center"
      vertical
    >
      <Flex>
        <Swimming />
      </Flex>
      <span> Swimming </span>
    </Flex>
  );

  return (
    <Flex
      style={{
        flex: 1,
        justifyContent: "space-around",
        marginBottom: "16px",
      }}
    >
      <span>{yogaTile}</span>
      <span>{pilateTile}</span>
      <span> {swimmingTile} </span>
      <span> {swimmingTile} </span>
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
      <span>{badmintonTile}</span>
      <span>{hiitTile}</span>
      <span> {strengthTile} </span>
      <span> {strengthTile} </span>
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
              width: "360px",
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
