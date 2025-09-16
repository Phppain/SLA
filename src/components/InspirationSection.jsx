import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const inspirations = [
  {
    title: "Уютная гостиная",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
  },
  {
    title: "Простая сервировка",
    image: "https://images.pexels.com/photos/33097116/pexels-photo-33097116.jpeg?_gl=1*qebh23*_ga*...",
  },
  {
    title: "Идеи для гардероба",
    image: "https://images.pexels.com/photos/4641825/pexels-photo-4641825.jpeg?_gl=1*k4g6tr*_ga*...",
  },
];

const InspirationSection = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <section className="px-4 sm:px-6 md:px-10 lg:px-16 py-12 bg-white max-w-[calc(100vw-16rem)] mx-auto">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-10 text-center text-gray-900">
        Идеи для вдохновения
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {inspirations.map((item, index) => (
          <div
            key={index}
            className="rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
            data-aos="fade-up"
            data-aos-delay={index * 100}
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-52 sm:h-56 md:h-64 lg:h-72 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800">{item.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default InspirationSection;
