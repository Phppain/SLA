import React from "react";
import { useNavigate } from "react-router-dom";

const categories = [
  {
    name: "Все",
    image: "https://images.pexels.com/photos/11325889/pexels-photo-11325889.jpeg?_gl=1*1oo3m6w*_ga*MjE0MDY0OTQwOC4xNzUzNDQ2NDQ3*_ga_8JE65Q40S6*czE3NTM0NDY0NDckbzEkZzEkdDE3NTM0NDcxOTEkajQkbDAkaDA.",
  },
  {
    name: "Искусство",
    image: "https://images.pexels.com/photos/3893650/pexels-photo-3893650.jpeg?_gl=1*18y0yst*_ga*MjE0MDY0OTQwOC4xNzUzNDQ2NDQ3*_ga_8JE65Q40S6*czE3NTM0NDY0NDckbzEkZzEkdDE3NTM0NDY1MjYkajQ5JGwwJGgw",
  },
  {
    name: "Красота",
    image: "https://images.pexels.com/photos/704815/pexels-photo-704815.jpeg?_gl=1*z26sq7*_ga*MjE0MDY0OTQwOC4xNzUzNDQ2NDQ3*_ga_8JE65Q40S6*czE3NTM0NDY0NDckbzEkZzEkdDE3NTM0NDY2NTIkajE3JGwwJGgw",
  },
  {
    name: "Фитнес",
    image: "https://images.pexels.com/photos/841131/pexels-photo-841131.jpeg?_gl=1*mct7y6*_ga*MjE0MDY0OTQwOC4xNzUzNDQ2NDQ3*_ga_8JE65Q40S6*czE3NTM0NDY0NDckbzEkZzEkdDE3NTM0NDY3MjEkajM1JGwwJGgw",
  },
  {
    name: "Мода",
    image: "https://images.pexels.com/photos/157675/fashion-men-s-individuality-black-and-white-157675.jpeg?_gl=1*5bvsm8*_ga*MjE0MDY0OTQwOC4xNzUzNDQ2NDQ3*_ga_8JE65Q40S6*czE3NTM0NDY0NDckbzEkZzEkdDE3NTM0NDY3OTAkajM4JGwwJGgw",
  },
  {
    name: "Путешествия",
    image: "https://images.pexels.com/photos/27500629/pexels-photo-27500629.jpeg?_gl=1*pom9nu*_ga*MjE0MDY0OTQwOC4xNzUzNDQ2NDQ3*_ga_8JE65Q40S6*czE3NTM0NDY0NDckbzEkZzEkdDE3NTM0NDY4NDEkajQ5JGwwJGgw",
  },
  {
    name: "Еда",
    image: "https://images.pexels.com/photos/769289/pexels-photo-769289.jpeg?_gl=1*ngsx1v*_ga*MjE0MDY0OTQwOC4xNzUzNDQ2NDQ3*_ga_8JE65Q40S6*czE3NTM0NDY0NDckbzEkZzEkdDE3NTM0NDY5MzIkajIxJGwwJGgw",
  },
  {
    name: "Игры",
    image: "https://images.pexels.com/photos/275033/pexels-photo-275033.jpeg?_gl=1*jooyuo*_ga*MjE0MDY0OTQwOC4xNzUzNDQ2NDQ3*_ga_8JE65Q40S6*czE3NTM0NDY0NDckbzEkZzEkdDE3NTM0NDcwMTkkajckbDAkaDA.",
  },
  // {
  //   name: "Автомобили",
  //   image: "https://images.pexels.com/photos/235222/pexels-photo-235222.jpeg?_gl=1*1fecjml*_ga*MjE0MDY0OTQwOC4xNzUzNDQ2NDQ3*_ga_8JE65Q40S6*czE3NTM0NDY0NDckbzEkZzEkdDE3NTM0NDcxMzYkajU5JGwwJGgw",
  // },
];

const CategoryGrid = () => {
  const navigate = useNavigate();

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Категории</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((category) => (
          <div
            key={category.name}
            onClick={() => navigate(`/category/${category.name}`)}
            className="relative cursor-pointer rounded-2xl overflow-hidden shadow-md group"
          >
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-40 object-cover transform group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-60 transition-opacity duration-300 flex items-center justify-center">
              <p className="text-white text-lg font-semibold z-10">
                {category.name}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryGrid;
