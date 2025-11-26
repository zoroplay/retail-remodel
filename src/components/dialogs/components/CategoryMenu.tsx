import React from "react";
import { Sport, SportCategory } from "../../../data/types/betting.types";

type Props = {
  selectedSport: Sport;
  onCategorySelect?: (category: SportCategory) => void;
  onBack?: () => void;
  data?: { sports?: SportCategory[] };
};

const CategoryMenu = ({
  selectedSport,
  onCategorySelect,
  onBack,
  data,
}: Props) => {
  //   const { data, isLoading } = useSportCategoriesQuery({
  //     sport_id: selectedSport.sportID,
  //     period: "all",
  //     timeoffset: "0",
  //   });

  const handleCategoryPress = (category: SportCategory) => {
    if (onCategorySelect) {
      onCategorySelect(category);
    }
  };

  //   if (isLoading) {
  //     return (
  //       <div className="flex-1 flex justify-center items-center">
  //         <p className="text-white text-lg">Loading categories...</p>
  //       </div>
  //     );
  //   }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4">
        {/* Header with back button */}
        <div className="flex flex-row items-center mb-4">
          <button
            onClick={onBack}
            className="mr-3 p-2 bg-gray-600 rounded-lg hover:bg-gray-500 transition-colors"
          >
            <span className="text-white text-lg">←</span>
          </button>
          <h2 className="text-white text-xl font-bold">
            {selectedSport.sportName} - Categories
          </h2>
        </div>

        <div className="flex flex-row flex-wrap justify-between">
          {data?.sports?.map((category) => (
            <button
              key={category.categoryID}
              onClick={() => handleCategoryPress(category)}
              className="w-[48%] bg-gray-700 rounded-lg p-4 mb-3 hover:bg-gray-600 active:bg-gray-500 transition-colors text-left"
            >
              <p className="text-white text-lg font-semibold mb-2">
                {category.categoryName}
              </p>
              <p className="text-gray-300 text-sm">
                {category.total} tournaments
              </p>
              {category.code && (
                <p className="text-blue-400 text-xs mt-1">
                  Code: {category.code}
                </p>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryMenu;
