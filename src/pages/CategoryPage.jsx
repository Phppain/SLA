import React from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Masonry from "react-masonry-css";
import PinCard from "../components/PinCard";
import { openPinModal } from "../features/modal/modalSlice";

const CategoryPage = () => {
  const { name } = useParams();
  const dispatch = useDispatch();
  const allPins = useSelector((state) => state.pins.pins);

  const filteredPins =
    name === "Все"
      ? allPins
      : allPins.filter((pin) => pin.category === name);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">
        {name === "Все" ? "Все пины" : `Категория: ${name}`}
      </h2>
      {filteredPins.length > 0 ? (
        <Masonry
          breakpointCols={{ default: 4, 1100: 3, 700: 2 }}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {filteredPins.map((pin) => (
            <div
              key={pin.id}
              onClick={() => dispatch(openPinModal(pin.id))}
              className="cursor-pointer"
            >
              <PinCard pin={pin} />
            </div>
          ))}
        </Masonry>
      ) : (
        <p>Пинов пока нет.</p>
      )}
    </div>
  );
};

export default CategoryPage;
