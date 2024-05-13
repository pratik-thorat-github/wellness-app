import { RouteComponentProps } from "@reach/router";
import { Flex } from "antd";
import LandingHeader from "./Header";
import useWindowDimensions from "../../hooks/getWindowDimensions";
import { useEffect } from "react";
import LandingFooter from "./Footer";
import LandingContent from "./Content";

interface ILandingPage extends RouteComponentProps {}

const LandingPage: React.FC<ILandingPage> = () => {
  const dimensions = useWindowDimensions();

  useEffect(() => {
    console.log(dimensions);
  }, []);

  return (
    <Flex
      flex={1}
      style={{
        minHeight: `${dimensions.height * 0.13}vh`,
      }}
      vertical
    >
      <Flex flex={1} align="flex-start">
        <LandingHeader />
      </Flex>
      <Flex flex={1} align="center">
        <LandingContent />
      </Flex>
      <Flex flex={1} align="flex-end">
        <LandingFooter />
      </Flex>
    </Flex>
  );
};

export default LandingPage;
