import { useState } from "react";
import { IGymCard } from "../../types/gyms";
import "./style.css";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

interface IGymPhotos {
  gym?: IGymCard;
  showArray?: boolean;
}

const GymPhotos: React.FC<IGymPhotos> = ({ gym, showArray = true }) => {


  const onSlideChange=(args:any)=>{
    console.log(args)
    // args!==1 && pauseVideo()
  }

  const pauseVideo=()=>{
    const vid= document.getElementById("gym-video") as HTMLVideoElement
    vid?.pause()
  }

  if (gym?.photos?.length) {
    const images = gym?.photos.map((p, ind) => {
      if(ind==1){
        return <video id="gym-video" key="gym-video" autoPlay={true} controls width="100%" muted>
        <source
          src="https://archive.org/download/ElephantsDream/ed_1024_512kb.mp4"
          type="video/mp4"
        />
      </video>
      }
      else return <img key={`${gym.gymId}-${ind}`} src={p} width="100%" />;
    });
    return (
      <div className="carouselWrap">
        <Carousel
          swipeable={showArray}
          showArrows={false}
          showIndicators={showArray}
          swipeScrollTolerance={100}
          showThumbs={false}
          onChange={onSlideChange}
          renderIndicator={(onClickHandler, isSelected, index, label) => {
            const defStyle = {
              display:'block',
              borderRadius: "100px",
              background: "rgba(201, 201, 201, 0.55)",
              backdropFilter: "blur(1.5px)",
              width: "14px",
              height: "2px",
               marginLeft: 2, cursor: "pointer" };
            const style = isSelected
              ? { ...defStyle, background: "white" }
              : { ...defStyle };
            return (
              <span
              className="customDots"
                style={style}
                onClick={onClickHandler}
                onKeyDown={onClickHandler}
                key={index}
                role="button"
                tabIndex={0}
                aria-label={`${label} ${index + 1}`}
              >
                {''}
              </span>
            );
          }}
        >
          {/* {images.concat([
            <video key="gym-video" controls>
              <source
                src="https://archive.org/download/ElephantsDream/ed_1024_512kb.mp4"
                type="video/mp4"
              />
            </video>
          ])} */}
          {images}
        </Carousel>
      </div>
    );
  } else return null;
};

export default GymPhotos;
