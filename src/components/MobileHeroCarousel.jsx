import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const MobileHeroCarousel = () => {
  const images = [
    "/mnt/data/1762113420203_lxvwzy.jpg",
    "/mnt/data/footer-bg_1603118929_qebw9g.webp",
    "/mnt/data/Banaras_Banner_l55zv5.jpg"
  ];

  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 800,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true
  };

  return (
    <div className="block md:hidden w-full">
      <Slider {...settings}>
        {images.map((src, index) => (
          <div key={index} className="w-full overflow-hidden">
            <img
              src={src}
              alt={`banner-${index}`}
              className="w-full h-auto object-cover"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default MobileHeroCarousel;
