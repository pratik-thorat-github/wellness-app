import { IGymCard } from "../../types/gyms";

import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

interface IGymPhotos {
  gym?: IGymCard;
  showArray?: boolean;
}

const GymPhotos: React.FC<IGymPhotos> = ({ gym, showArray = true }) => {
  if (gym?.photos?.length) {
    const images = gym?.photos.map((p, ind) => {
      return <img src={p} width="100%" />;
    });
    return (
      <div className="h-56 sm:h-64 xl:h-80 2xl:h-96">
        <Carousel showThumbs={false}>{images}</Carousel>
      </div>
    );
  } else return null;
};

export default GymPhotos;
