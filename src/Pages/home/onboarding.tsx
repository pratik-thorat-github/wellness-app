import React, { useState } from "react";
import ob1 from "../../images/home/ob1.jpg";
import ob2 from "../../images/home/ob2.png";
import Dance from "../../images/home/Dance.png";
import Yoga from "../../images/home/Yoga.png"
import Boxing from "../../images/home/Boxing.png"
import Baddy from "../../images/home/Baddy.png"
import Gym from "../../images/home/Gym.png";
import Swim from "../../images/home/Swim.png"

import { Carousel } from "react-responsive-carousel";




interface Onboarding {
  setOnboarding: (val: boolean) => void;
}

const Onboarding: React.FC<Onboarding> = ({ setOnboarding }) => {

    const [slide,setSlide]=useState<number>(0)


const acitivities = (slide:number) => (
  <div className="obActWrap">
    <div>
      <span className={[0,6,12].includes(slide) ?'bold':''} style={{color:'#9DD698'}} > Dance</span> 
      <span style={{color:'#D69898'}} className={[2,8,14].includes(slide) ?'bold':''}>Badminton</span>
    </div>
    <div>
    <span style={{color:'#D6CC98'}} className={[3,9,15].includes(slide) ?'bold':''}>Gym</span>
    <span style={{color:'#9DD698'}} className={[1,7,13].includes(slide) ?'bold':''}>Yoga</span>
    <span style={{color:'#989BD6'}} className={[4,10,16].includes(slide) ?'bold':''}>Boxing</span>



    </div>
    <div>
      <span style={{color:'#D6CC98'}} className={[5,11,17].includes(slide) ?'bold':''}>Swimming </span>
      <span style={{color:'#98B8D6'}}>Pilates</span>

    </div>
    <div>
      <span style={{color:'#D69898'}}>Football</span>
      <span style={{color:'#D6CC98'}}>Cricket</span>
    </div>
    <div>
    <span style={{color:'#D6AB98'}}>HIIT</span>
    <span style={{color:'#989BD6'}}>SPIN</span>
    <span style={{color:'#D69898'}} className={[4,10,16].includes(slide) ?'bold':''}>Strength</span>
    </div>
  </div>
);

const images = [
  { id: "Dance", url: Dance },
  { id: "Yoga", url: Yoga },
  { id: "Baddy", url: Baddy },
  { id: "Gym", url: Gym },
  { id: "Boxing", url: Boxing },
  {id:"Swim",url:Swim},
  { id: "Dance", url: Dance },
  { id: "Yoga", url: Yoga },
  { id: "Baddy", url: Baddy },
  { id: "Gym", url: Gym },
  { id: "Boxing", url: Boxing },
  {id:"Swim",url:Swim},
  { id: "Dance", url: Dance },
  { id: "Yoga", url: Yoga },
  { id: "Baddy", url: Baddy },
  { id: "Gym", url: Gym },
  { id: "Boxing", url: Boxing },
  {id:"Swim",url:Swim},
  { id: "Dance", url: Dance },
  { id: "Yoga", url: Yoga },
  { id: "Baddy", url: Baddy },
  { id: "Gym", url: Gym },
  { id: "Boxing", url: Boxing },
  {id:"Swim",url:Swim},
];
const medias = images.map(i=>(
    <img src={i.url} className="obImg"/>
))

  return (
    <div className="obWrap">
        <div className="obacitivities">
            {acitivities(slide)}
        </div>
      <div className="obImgWrap">
      <Carousel
          swipeable={true}
          showArrows={false}
          showThumbs={false}
          autoPlay={true}
          interval={1200}
          onChange={(i)=>setSlide(i)}
          infiniteLoop
        >
          {medias}
        </Carousel>
      </div>
      <div className='exploreBtn'>
        <div style={{padding:'0px 24px 16px 24px'}}>
        <div className="fh1">
            ZenfitX
        </div>
        <div className="fh2">
        Explore & book any  fitness or wellness activity near you!
        </div>
        </div>
        <span className="obBtn" onClick={() => setOnboarding(true)}>Explore Now</span></div>
    </div>
  );
};

export default Onboarding;
