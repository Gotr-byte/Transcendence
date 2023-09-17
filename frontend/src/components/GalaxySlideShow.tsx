import { Box } from "@chakra-ui/react";
import Slider from "react-slick";
import '../../node_modules/slick-carousel/slick/slick.css'; 
import '../../node_modules/slick-carousel/slick/slick-theme.css';

const GalaxySlideShow: React.FC = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
  };

  // Generate URLs from heic1501a.jpg to heic1526a.jpg
  const baseUrls1 = "https://cdn.spacetelescope.org/archives/images/wallpaper2/heic15";
  const urls1 = Array.from({ length: 26 }, (_, i) => `${baseUrls1}${i.toString().padStart(2, '0')}a.jpg`);

  // Generate URLs from heic2013b.jpg to heic2021b.jpg
  const baseUrls2 = "https://cdn.spacetelescope.org/archives/images/thumb700x/heic20";
  const urls2 = Array.from({ length: 9 }, (_, i) => `${baseUrls2}${13 + i}b.jpg`);

  // Combine both sets of URLs
  const urls = [...urls1, ...urls2];

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
