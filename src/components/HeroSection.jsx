import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="py-10 px-4 sm:px-6 md:px-10 lg:px-16 bg-white dark:bg-gray-900 max-w-[calc(100vw-16rem)] mx-auto mb-10">
      <motion.h1
        className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-center text-gray-900 dark:text-white leading-snug"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        Найдите свежие идеи
      </motion.h1>

      <motion.p
        className="text-center text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
      >
        Идеи блюд на ужин, вдохновение для декора, советы по стилю и многое другое — всё в одном месте.
      </motion.p>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-2"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        viewport={{ once: true }}
      >
        {[
          {
            title: "Домашний уют",
            img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
          },
          {
            title: "Ужин мечты",
            img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
          },
          {
            title: "Интерьер мечты",
            img: "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?_gl=1*197radj*_ga*MjE0MDY0OTQwOC4xNzUzNDQ2NDQ3*_ga_8JE65Q40S6*czE3NTM1MDk4NDUkbzIkZzEkdDE3NTM1MDk4OTckajgkbDAkaDA.",
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            className="relative rounded-xl overflow-hidden shadow-lg group cursor-pointer"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src={item.img}
              alt={item.title}
              className="w-full h-48 sm:h-56 md:h-60 lg:h-64 xl:h-72 object-cover transform group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-50 transition duration-300" />
            <h3 className="absolute bottom-4 left-4 text-white text-lg sm:text-xl font-semibold z-10">
              {item.title}
            </h3>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default HeroSection;
