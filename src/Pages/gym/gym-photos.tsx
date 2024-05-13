import Carousel from "better-react-carousel";

const GymPhotos: React.FC = () => {
  return (
    <Carousel cols={1} loop>
      <Carousel.Item>
        <img
          width="100%"
          // height="100%"
          src="https://picsum.photos/800/600?random=1"
        />
      </Carousel.Item>
      <Carousel.Item>
        <img
          width="100%"
          // height="100%"
          src="https://picsum.photos/800/600?random=2"
        />
      </Carousel.Item>
      <Carousel.Item>
        <img
          width="100%"
          // height="100%"
          src="https://picsum.photos/800/600?random=3"
        />
      </Carousel.Item>
      {/* ... */}
    </Carousel>
  );
};

export default GymPhotos;
