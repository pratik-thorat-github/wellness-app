import { Affix, Card, Flex } from "antd";
import { useState } from "react";

import Carousel from "better-react-carousel";

function generateActivityFilters() {
  const allTile = <Card> all </Card>;
  const yogaTile = <Card> yoga </Card>;
  const swimmingTile = <Card> swimming </Card>;
  const zumbaTile = <Card> zumba </Card>;
  const pilateTile = <Card> pilate </Card>;
  const badmintonTile = <Card> badminton </Card>;
  const hiitTile = <Card> hiit </Card>;
  const strengthTile = <Card> strength </Card>;

  return (
    <Flex
      style={{
        flex: 1,
        justifyContent: "space-evenly",
        alignContent: "center",
        fontWeight: "bold",
      }}
    >
      <span>{allTile}</span>
      <span>{yogaTile}</span>
      <span>{swimmingTile}</span>
      <span>{zumbaTile}</span>
      <span>{pilateTile}</span>
      <span>{badmintonTile}</span>
      <span>{hiitTile}</span>
      <span> {strengthTile} </span>
      <span> {strengthTile} </span>
    </Flex>
  );
}

const Gallery = () => {
  return (
    <Carousel cols={1} loop>
      <Carousel.Item>
        <img width="100%" src="https://picsum.photos/800/600?random=1" />
      </Carousel.Item>
      <Carousel.Item>
        <img width="100%" src="https://picsum.photos/800/600?random=2" />
      </Carousel.Item>
      <Carousel.Item>
        <img width="100%" src="https://picsum.photos/800/600?random=3" />
      </Carousel.Item>
      {/* ... */}
    </Carousel>
  );
};

const CentersAroundYou: React.FC = () => {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  function getListOfCenters(activity: string = "all") {
    const onChange = (currentSlide: number) => {
      console.log(currentSlide);
    };

    const generateCards = [1, 2].map((e) => {
      return (
        <Flex
          key={e}
          flex={1}
          vertical
          style={{
            padding: "20px",
            borderRadius: "10px",
            borderWidth: "5px",
            borderColor: "black",
          }}
        >
          <Flex
            flex={2}
            style={{
              borderWidth: "10px",
              borderColor: "black",
              width: "100%",
              //   background: "blue",
            }}
          >
            {Gallery()}
          </Flex>

          <Flex flex={1} vertical style={{ background: "red" }}>
            <Flex flex={1}>
              <Flex flex={1} align="left">
                {" "}
                Chakra Athletic{" "}
              </Flex>
              <Flex flex={1} align="right">
                {" "}
                300Rs/class{" "}
              </Flex>
            </Flex>
            <Flex flex={1}> Yoga, HIIT Zumba & Pilate </Flex>
            <Flex flex={1}> Indiranagar </Flex>
          </Flex>
        </Flex>
      );
    });

    return (
      <Flex flex={1} vertical justify="space-evenly" style={{ width: "100%" }}>
        {generateCards}
      </Flex>
    );
  }

  return (
    <Flex
      flex={1}
      vertical
      style={{ marginTop: "10px" }}
      justify="space-evenly"
    >
      <Flex flex={1} style={{ fontWeight: "bold" }}>
        10+ fitness centres around you
      </Flex>

      <Flex flex={1}>
        <div style={{ width: "80%", overflow: "auto" }}>
          {generateActivityFilters()}
        </div>
      </Flex>

      <Flex flex={3} style={{}}>
        {getListOfCenters()}
      </Flex>
    </Flex>
  );
};

export default CentersAroundYou;
