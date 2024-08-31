import { Flex } from "antd";

import "./style.css";
import { navigate } from "@reach/router";

import { ReactComponent as HomeBannerWithoutPlus } from "../../images/home/home-banner-without-plus.svg";
import { Mixpanel } from "../../mixpanel/init";
import { useAtom } from "jotai/react";
import { plusDetailsAtom } from "../../atoms/atom";
import PlusClassRemaining from "../profile/plus-classes-remaining";
import { ReactComponent as Banner } from "../../images/home/banner.svg";


const HomeBanner: React.FC = () => {
  const [plusDetails] = useAtom(plusDetailsAtom);

  const userDetails =window.localStorage.getItem("zenfitx-user-details") && JSON.parse(window.localStorage["zenfitx-user-details"])
  return (
    // <Flex
    //   onClick={() => {
    //     // Mixpanel.track("clicked_plus_banner_home");
    //     // navigate("/checkout/plus");
    //   }}
    //   flex={1}
    //   className="home-banner"
    //   vertical
    //   justify="center"
    //   // className="home-banner"
    //   style={{
    //     paddingTop: "16px",
    //     paddingLeft: "24px",
    //     paddingBottom: "16px",
    //     marginRight: "16px",
    //     borderRadius: "24px",
    //   }}
    // >
    //   {/* {plusDetails?.isPlusMember ? (
    //     <PlusClassRemaining />
    //   ) : (
    //     <PlusBanner width={"90vw"} height={"100%"} />
    //   )} */}

    //   <span
    //     style={{ marginBottom: "4px", fontSize: "16px", fontWeight: "bolder" }}
    //   >
    //     Welcome to ZenfitX!
    //   </span>
    //   <span style={{ fontSize: "14px" }}>
    //     Discover & book fitness activities near you.
    //   </span>

    //   {/* <Flex
    //     flex={1}
    //     vertical
    //     align="left"
    //     justify="left"
    //     style={{ paddingLeft: "10px" }}
    //   >
    //     <span> 1 month plan @{plusDetails?.plusMemberShipPrice} only </span>

    //     <span style={{ marginTop: "10px" }}>
    //       {" "}
    //       Save up to {plusDetails?.plusDiscountPercent}% off on every class
    //       booking ✨{" "}
    //     </span>
    //   </Flex>
    //   <Flex
    //     flex={1}
    //     align="center"
    //     justify="right"
    //     style={{ paddingRight: "10px", color: "white" }}
    //   >
    //     <HomeBannerLogo />
    //   </Flex> */}
    // </Flex>
    <>
    <div style={{'width':'100%'}}><Banner/></div>
    {!userDetails && <div className="homeWrapper">
      <div style={{paddingTop:"40px"}}>
        <span className="zenfit">Zenfit</span><span className="x">X</span>

      </div>
      <div className="head2">
      Book any fitness activity near you! 
      <br></br>
      Just pay for sessions not memberships!
      </div>
      {/* <div className="head3">
      50% off on your first booking.
      </div> */}
    </div>}
    {userDetails && <div className="loginWrapper">
      <div className="loginHead1">
        <span className="loginName">Hi {userDetails?.name.split(' ')[0]}</span><span className="bookings" onClick={()=>navigate('/profile')}>Bookings</span>

      </div>
      <div className="loginHead2">
      Welcome to ZenfitX!
      </div>
      <div className="loginHead3">
      Explore & book any fitness or wellness activity near you!
      </div>
    </div>}
    </>
  );
};

export default HomeBanner;
