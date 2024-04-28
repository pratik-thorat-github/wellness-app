import { Flex, Image, Space } from "antd";

import { ReactComponent as HomeBannerLogo } from "../../images/home/banner-percentage.svg";
import "./style.css";

const HomeBanner: React.FC = ({}) => {
  return (
    <Flex
      flex={1}
      className="home-banner"
      //   style={{
      //     padding: "10px",
      //     borderRadius: "10px",
      //   }}
    >
      <Flex flex={1} vertical align="left" justify="left">
        <span> 1 month plan @199 only </span>

        <span style={{ marginTop: "10px" }}>
          {" "}
          Save up to 15% off on every class booking ✨{" "}
        </span>
      </Flex>
      <Flex
        flex={1}
        align="center"
        justify="right"
        style={{ paddingRight: "5px" }}
      >
        <HomeBannerLogo />
      </Flex>
    </Flex>
  );
};

export default HomeBanner;
