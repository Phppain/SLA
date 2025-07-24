import React, { useState } from "react";
import { useSelector } from "react-redux";
import Masonry from "react-masonry-css";
import PinCard from "../components/PinCard";
import PinModal from "../components/PinModal";
import CategoryGrid from "../components/CategoryGrid";

const Home = () => {
  const pins = useSelector((state) => state.pins.pins);
  const query = (useSelector((state) => state.search.query) || "").toLowerCase();
  const selectedCategory = useSelector((state) => state.category.selectedCategory);

  const [selectedPin, setSelectedPin] = useState(null);

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
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {filteredPins.map((pin) => (
          <PinCard key={pin.id} pin={pin} onClick={() => setSelectedPin(pin)} />
        ))}
      </Masonry>
      {selectedPin && (
        <PinModal pin={selectedPin} onClose={() => setSelectedPin(null)} />
      )}
    </div>
  );
};

export default Home;