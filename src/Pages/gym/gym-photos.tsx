import { MDBCarousel, MDBCarouselItem } from "mdb-react-ui-kit";
import "mdb-react-ui-kit/dist/css/mdb.min.css";

interface IGymPhotos {
  photos?: string[];
}

const GymPhotos: React.FC<IGymPhotos> = ({ photos }) => {
  if (photos?.length) {
    const images = photos.map((p, ind) => {
      return (
        <MDBCarouselItem itemId={ind}>
          <img src={p} width="100%" />
        </MDBCarouselItem>
      );
    });

    return (
      <MDBCarousel showIndicators fade touch showControls>
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
