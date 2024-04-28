import { Affix, Card, Flex } from "antd";

import { ReactComponent as Yoga } from "../../images/home/class-images/yoga.svg";
import { ReactComponent as Pilate } from "../../images/home/class-images/pilate.svg";
import { ReactComponent as Swimming } from "../../images/home/class-images/swimming.svg";
import { ReactComponent as Badminton } from "../../images/home/class-images/badminton.svg";
import { ReactComponent as Hiit } from "../../images/home/class-images/hiit.svg";
import { ReactComponent as Strength } from "../../images/home/class-images/strength.svg";

function createUpperCardTiles() {
  let yogaTile = (
    <Card>
      <Yoga />
    </Card>
  );

  let pilateTile = (
    <Card>
      <Pilate />
    </Card>
  );

  let swimmingTile = (
    <Card>
      <Swimming />
    </Card>
  );

  return (
    <Flex
      style={{
        flex: 1,
        justifyContent: "space-evenly",
        alignContent: "center",
      }}
    >
      <span>{yogaTile}</span>
      <span>{pilateTile}</span>
      <span> {swimmingTile} </span>
      <span> {swimmingTile} </span>
    </Flex>
  );
}

function createLowerCardTiles() {
  let badmintonTile = (
    <Card>
      <Badminton />
    </Card>
  );

  let hiitTile = (
    <Card>
      <Hiit />
    </Card>
  );

  let strengthTile = (
    <Card>
      <Strength />
    </Card>
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
    <Flex flex={1} vertical style={{ marginTop: "20px" }}>
      <Flex flex={1} align="left" style={{ fontWeight: "bold" }}>
        {" "}
        Book classes near you{" "}
      </Flex>

      <Flex flex={3}>
        <Flex flex={1} vertical>
          <div style={{ width: "95%", overflow: "auto" }}>
            <Flex flex={1} wrap="nowrap">
              {createUpperCardTiles()}
            </Flex>
            <Flex flex={1} wrap="nowrap">
              {createLowerCardTiles()}
            </Flex>
          </div>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ClassesNearYou;
