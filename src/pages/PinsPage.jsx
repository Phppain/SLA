import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { openPinModal } from "../features/modal/modalSlice"; // ⬅ импортируем
import PinCard from "../components/PinCard";
import CategoryGrid from "../components/CategoryGrid";
import Masonry from "react-masonry-css";

const PinsPage = () => {
  const dispatch = useDispatch();
  const pins = useSelector((state) => state.pins.pins);
  const query = useSelector((state) => state.search.query)?.toLowerCase() || "";
  const selectedCategory = useSelector((state) => state.category.selectedCategory);

  const filteredPins = pins.filter((pin) => {
    const matchQuery = pin.title.toLowerCase().includes(query);
    const matchCategory = selectedCategory ? pin.category === selectedCategory : true;
    return matchQuery && matchCategory;
  });

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  return (
    <div className="p-4">
      <CategoryGrid />
      {filteredPins.length === 0 ? (
        <p className="text-center text-gray-500">Пины не найдены.</p>
      ) : (
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {filteredPins.map((pin) => (
            <div
              key={pin.id}
              onClick={() => dispatch(openPinModal(pin.id))} // ⬅ заменили
              className="cursor-pointer"
            >
              <PinCard pin={pin} />
            </div>
          ))}
        </Masonry>
      )}
    </div>
  );
};

export default PinsPage;
