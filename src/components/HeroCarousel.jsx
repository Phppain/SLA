import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";
import imageFood from '../image/food.jpg';
import imageStyle from '../image/style.jpg';
import imageIdea from '../image/freashidea.jpg';
import imageDekor from '../image/dekor.jpg';
import imageTravel from '../image/travel.jpg';

const slides = [
  {
    text: "Найдите свежие идеи",
    image: imageIdea,
  },
  {
    text: "Идеи блюд на ужин",
    image: imageFood,
  },
  {
    text: "Декор для дома",
    image: imageDekor,
  },
  {
    text: "Стильные образы",
    image: imageStyle,
  },
  {
    text: "Уютные места для путешествий",
    image: imageTravel,
  },
];

export default function HeroCarousel() {
  return (
    <div className="w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden rounded-xl shadow-xl mb-8">
      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop
        className="h-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div
              className="relative w-full h-full bg-cover bg-center flex items-center justify-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-40 z-0"></div>
              <h2 className="z-10 text-white text-3xl md:text-4xl lg:text-5xl font-bold text-center px-4 drop-shadow-lg">
                {slide.text}
              </h2>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
