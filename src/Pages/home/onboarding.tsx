import React, { useEffect, useState } from "react";
import Dance from "../../images/home/Dance.png";
import Yoga from "../../images/home/Yoga.png";
import Boxing from "../../images/home/Boxing.png";
import Badminton from "../../images/home/Badminton.png";
import Gym from "../../images/home/Gym.png";
import Swim from "../../images/home/Swim.png";
import Pickelball from "../../images/home/Pickelball.png";

import { Carousel } from "react-responsive-carousel";
import { Mixpanel } from "../../mixpanel/init";

interface Onboarding {
  setOnboarding: (val: boolean) => void;
}

const Onboarding: React.FC<Onboarding> = ({ setOnboarding }) => {

  useEffect(() => {
    Mixpanel.track("open_onboarding_page");
  }, []);

  const images = [
		{ id: "Pickelball", url: Pickelball },
		{ id: "Baddy", url: Badminton },
		{ id: "Swim", url: Swim },
		{ id: "Gym", url: Gym },
		{ id: "Dance", url: Dance },
		{ id: "Yoga", url: Yoga },
		{ id: "Boxing", url: Boxing }
	];
	const medias = images.map((i) => <img src={i.url} className="obImg" />);

  return (
		<>
			<div className="obImgWrap">
				<Carousel
					swipeable={true}
					showArrows={false}
					showThumbs={false}
					autoPlay={true}
					interval={1200}
					infiniteLoop
					animationHandler="fade"
				>
					{medias}
				</Carousel>
			</div>
			<div className="exploreBtn">
				<div style={{ padding: "0px 24px 16px 24px", width: "82vw" }}>
					<div className="fh1">ZenfitX</div>
					<div className="fh2">
						Explore & book any fitness or wellness activity near you!
					</div>
				</div>
				<span
					className="obBtn"
					onClick={() => {
						setOnboarding(true);
						Mixpanel.track("clicked_explore_now_on_onboarding_page");
					}}
				>
					Explore Now
				</span>
			</div>
		</>
	);
};

export default Onboarding;
