import { MDBCarousel, MDBCarouselItem } from "mdb-react-ui-kit";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import { IGymCard } from "../../types/gyms";
import { Counter } from "./carousel-indicator";

interface IGymPhotos {
  gym?: IGymCard;
}

const GymPhotos: React.FC<IGymPhotos> = ({ gym }) => {
  let c = new Counter();

  if (gym?.photos?.length) {
    const images = gym?.photos.map((p, ind) => {
      return (
        <MDBCarouselItem key={`${gym.gymId}-${ind}`} itemId={ind}>
          <img src={p} width="100%" />
        </MDBCarouselItem>
      );
    });

    return (
      <MDBCarousel key={gym.gymId} showIndicators fade touch showControls>
        {images}
      </MDBCarousel>
    );
  }

  return (
    <MDBCarousel showIndicators fade touch showControls>
      <MDBCarouselItem itemId={1}>
        <img
          src="https://zfx-gyms.zenfitx.link/images/prod/1/Yog-Gurukul-1.jpg"
          width="100%"
          // className="d-block w-100"
          alt="..."
        />
      </MDBCarouselItem>
      <MDBCarouselItem itemId={2}>
        <img
          src="https://zfx-gyms.zenfitx.link/images/1/badminton-1.jpg"
          width="100%"
          // className="d-block w-100"
          alt="..."
        />
      </MDBCarouselItem>
      <MDBCarouselItem itemId={3}>
        <img
          src="https://zfx-gyms.zenfitx.link/images/1/badminton-2.jpg"
          width="100%"
          // className="d-block w-100"
          alt="..."
        />
      </MDBCarouselItem>
    </MDBCarousel>
  );
};

export default GymPhotos;
