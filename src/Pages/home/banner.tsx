import { Flex } from "antd";

import "./style.css";
import { navigate } from "@reach/router";

import { ReactComponent as HomeBannerWithoutPlus } from "../../images/home/home-banner-without-plus.svg";
import { Mixpanel } from "../../mixpanel/init";
import { useAtom } from "jotai/react";
import { plusDetailsAtom } from "../../atoms/atom";
import PlusClassRemaining from "../profile/plus-classes-remaining";

const HomeBanner: React.FC = () => {
  const [plusDetails] = useAtom(plusDetailsAtom);

  return (
    <Flex
      onClick={() => {
        // Mixpanel.track("clicked_plus_banner_home");
        // navigate("/checkout/plus");
      }}
      flex={1}
      className="home-banner"
      vertical
      justify="center"
      // className="home-banner"
      style={{
        paddingTop: "16px",
        paddingLeft: "24px",
        paddingBottom: "16px",
        marginRight: "16px",

        borderRadius: "24px",
      }}
    >
      {/* {plusDetails?.isPlusMember ? (
        <PlusClassRemaining />
      ) : (
        <PlusBanner width={"90vw"} height={"100%"} />
      )} */}

      <span
        style={{ marginBottom: "4px", fontSize: "16px", fontWeight: "bolder" }}
      >
        Welcome to ZenfitX!
      </span>
      <span style={{ fontSize: "14px" }}>
        Discover & book fitness activities near you.
      </span>

      {/* <Flex
        flex={1}
        vertical
        align="left"
        justify="left"
        style={{ paddingLeft: "10px" }}
      >
        <span> 1 month plan @{plusDetails?.plusMemberShipPrice} only </span>

        <span style={{ marginTop: "10px" }}>
          {" "}
          Save up to {plusDetails?.plusDiscountPercent}% off on every class
          booking ✨{" "}
        </span>
      </Flex>
      <Flex
        flex={1}
        align="center"
        justify="right"
        style={{ paddingRight: "10px", color: "white" }}
      >
        <HomeBannerLogo />
      </Flex> */}
    </Flex>
  );
};

export default HomeBanner;
