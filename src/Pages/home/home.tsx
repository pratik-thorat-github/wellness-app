import { RouteComponentProps } from "@reach/router";
import { Flex, Space } from "antd";
import HomeBanner from "./banner";
import ClassesNearYou from "./classes-near-you";
import CentersAroundYou from "./centers-around-you";

interface IHome extends RouteComponentProps {}
const Home: React.FC<IHome> = ({}) => {
  return (
    <Flex flex={1} vertical style={{ margin: "10px" }}>
      <Space></Space>
      <Flex flex={1} style={{ fontFamily: "plus-jakarta-sans", fontSize: 20 }}>
        <>Hi!</>
      </Flex>
      <Flex flex={3}>
        <HomeBanner />
      </Flex>

      <Flex flex={3}>
        <ClassesNearYou />
      </Flex>

      <Flex flex={3}>
        <CentersAroundYou />
      </Flex>
    </Flex>
  );
};

const styles = {
  mainContainer: {
    flex: 1,
    flexDirection: "vertical",
    marginTop: "10px",
  },
};

export default Home;
