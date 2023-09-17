import { Box } from "@chakra-ui/react";
import Slider from "react-slick";
import '../../node_modules/slick-carousel/slick/slick.css'; 
import '../../node_modules/slick-carousel/slick/slick-theme.css';
import '../../styles.css'



const GalaxySlideShow: React.FC = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 20000,
  };

  // Generate URLs from heic1501a.jpg to heic1526a.jpg
  const baseUrls = "https://cdn.spacetelescope.org/archives/images/wallpaper2/heic15";
  const urls = Array.from({ length: 26 }, (_, i) => `${baseUrls}${i.toString().padStart(2, '0')}a.jpg`);

  return (
    <Box 
      position="fixed" 
      top={0} 
      left={0} 
      width="100vw" 
      height="100vh" 
      zIndex={-1}
    >
      <Slider {...settings}>
        {urls.map((url, index) => (
          <Box 
            key={index} 
            bgImage={`url(${url})`} 
            bgSize="cover" 
            bgPosition="center"
            width="100vw" 
            height="100vh"
            animation="floaty 30s infinite"
          >
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default GalaxySlideShow;
