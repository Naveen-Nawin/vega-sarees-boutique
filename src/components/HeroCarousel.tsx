// src/components/HeroCarousel.tsx
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useEffect } from "react";

const slides = [
  {
    img: "https://res.cloudinary.com/ddsuk1wka/image/upload/v1762112748/footer-bg_1603118929_qebw9g.webp",
    title: "Kanchipuram Sarees",
    text: "Traditional weaves meet modern flair, crafted perfectly in pure silk.",
  },
  {
    img: "https://res.cloudinary.com/ddsuk1wka/image/upload/v1762113540/1762113420203_lxvwzy.jpg",
    title: "Banarasi Silks",
    text: "Experience royal craftsmanship in timeless Banarasi designs.",
  },
  {
    img: "https://res.cloudinary.com/ddsuk1wka/image/upload/v1762112679/Banaras_Banner_l55zv5.jpg",
    title: "Tussar Elegance",
    text: "Natural texture and golden sheen for every grand occasion.",
  },
];

export default function HeroCarousel() {
  useEffect(() => {
    // Make the arrows lighter, flat, and minimal
    const buttons = document.querySelectorAll(
      ".swiper-button-prev, .swiper-button-next"
    );
    buttons.forEach((btn) => {
      const el = btn as HTMLElement;
      el.style.background = "transparent";
      el.style.border = "none";
      el.style.width = "auto";
      el.style.height = "auto";
      el.style.color = "rgba(255,255,255,0.6)";
      el.style.fontWeight = "600";
      el.style.textShadow = "0 1px 3px rgba(0,0,0,0.3)";
      el.style.transition = "color 0.3s ease, transform 0.3s ease";
      el.addEventListener("mouseenter", () => {
        el.style.color = "rgba(255,255,255,0.9)";
        el.style.transform = "scale(1.15)";
      });
      el.addEventListener("mouseleave", () => {
        el.style.color = "rgba(255,255,255,0.6)";
        el.style.transform = "scale(1)";
      });
    });
  }, []);

  return (
    <section className="w-full bg-white flex justify-center">
      <div className="max-w-[2000px] w-full px-4 mx-auto">


        
<Swiper
  modules={[Autoplay, Navigation, Pagination]}
  navigation
  pagination={{ clickable: true }}
  autoplay={{ delay: 4500, disableOnInteraction: false }}
  loop
className="
  w-full 
  h-[45vh] sm:h-[55vh] md:h-[65vh] lg:h-[72vh] 
  2xl:h-[78vh]
  rounded-none sm:rounded-lg 
  overflow-hidden shadow-lg
"


>

  {slides.map((slide, i) => (
    <SwiperSlide key={i}>
      <div
        className="
          relative w-full h-full 
          bg-cover bg-center sm:bg-top 
          flex items-center justify-center md:justify-end
        "
        style={{
          backgroundImage: `url(${slide.img})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Gradient overlay for clarity on text */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>

        {/* Text Section */}
        <div
          className="
            relative z-10 text-white text-center md:text-right 
            px-6 sm:px-10 md:px-16 lg:px-24 
            max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl
          "
        >
          <h2
            className="
              text-2xl sm:text-4xl md:text-5xl lg:text-6xl 
              font-serif font-semibold 
              mb-3 sm:mb-5 
              leading-tight drop-shadow-md
            "
          >
            {slide.title}
          </h2>

          <p
            className="
              text-sm sm:text-base md:text-lg lg:text-xl 
              mb-5 md:mb-6 text-gray-200 
              leading-relaxed max-w-md mx-auto md:ml-auto
            "
          >
            {slide.text}
          </p>

          <button
            onClick={() => {
              const section = document.getElementById("products");
              if (section) section.scrollIntoView({ behavior: "smooth" });
            }}
            className="
              bg-[#f9e3b7] text-[#8b1538] 
              font-semibold 
              py-2 px-6 sm:py-3 sm:px-8 
              rounded-full shadow 
              hover:scale-110 hover:bg-[#fff1cc] 
              transition-all duration-300
            "
          >
            SHOP NOW
          </button>
        </div>
      </div>
    </SwiperSlide>
  ))}
</Swiper>

      </div>
    </section>
  );
}
