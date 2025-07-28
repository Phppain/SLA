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
    image: "https://images.pexels.com/photos/33097116/pexels-photo-33097116.jpeg?_gl=1*qebh23*_ga*MjE0MDY0OTQwOC4xNzUzNDQ2NDQ3*_ga_8JE65Q40S6*czE3NTM1MDk4NDUkbzIkZzEkdDE3NTM1MTA1NzUkajQ2JGwwJGgw",
  },
  {
    title: "Идеи для гардероба",
    image: "https://images.pexels.com/photos/4641825/pexels-photo-4641825.jpeg?_gl=1*k4g6tr*_ga*MjE0MDY0OTQwOC4xNzUzNDQ2NDQ3*_ga_8JE65Q40S6*czE3NTM1MDk4NDUkbzIkZzEkdDE3NTM1MTA2OTMkajU5JGwwJGgw",
  },
];

const InspirationSection = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <section className="px-4 py-12 bg-white">
      <h2 className="text-3xl font-bold mb-8 text-center">Идеи для вдохновения</h2>
      <div className="grid md:grid-cols-3 gap-8">
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
              className="w-full h-64 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold">{item.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default InspirationSection;
