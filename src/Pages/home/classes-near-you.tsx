import { Affix, Card, Flex } from "antd";

import { ReactComponent as Yoga } from "../../images/home/class-images/yoga.svg";
import { ReactComponent as Pilate } from "../../images/home/class-images/pilate.svg";
import { ReactComponent as Swimming } from "../../images/home/class-images/swimming.svg";
import { ReactComponent as Badminton } from "../../images/home/class-images/badminton.svg";
import { ReactComponent as Hiit } from "../../images/home/class-images/hiit.svg";
import { ReactComponent as Strength } from "../../images/home/class-images/strength.svg";

function createUpperCardTiles() {
  let yogaTile = (
    <Flex justify="center" align="center" vertical>
      <Card>
        <Yoga />
      </Card>
      <span> Yoga </span>
    </Flex>
  );

  let pilateTile = (
    <Flex justify="center" align="center" vertical>
      <Card>
        <Pilate />
      </Card>
      <span> Pilate </span>
    </Flex>
  );

  let swimmingTile = (
    <Flex justify="center" align="center" vertical>
      <Card>
        <Swimming />
      </Card>
      <span> Swimming </span>
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
      <span>{yogaTile}</span>
      <span>{pilateTile}</span>
      <span> {swimmingTile} </span>
      <span> {swimmingTile} </span>
    </Flex>
  );
}

function createLowerCardTiles() {
  let badmintonTile = (
    <Flex justify="center" align="center" vertical>
      <Card>
        <Badminton />
      </Card>
      <span> Badminton </span>
    </Flex>
  );

  let hiitTile = (
    <Flex justify="center" align="center" vertical>
      <Card>
        <Hiit />
      </Card>
      <span> Hiit </span>
    </Flex>
  );

  let strengthTile = (
    <Flex justify="center" align="center" vertical>
      <Card>
        <Strength />
      </Card>
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
