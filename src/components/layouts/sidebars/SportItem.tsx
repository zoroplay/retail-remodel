import React, { useState } from "react";
import { Sport } from "@/data/types/betting.types";
import { useSportsCategoriesQuery } from "@/store/services/bets.service";
import CategoryItem from "./CategoryItem";
import CategorySkeleton from "./CategorySkeleton";
import { getClientTheme } from "@/config/theme.config";
import { IoChevronDown } from "react-icons/io5";
import { OVERVIEW } from "@/data/routes/routes";
import { useNavigate } from "react-router-dom";

type Props = {
  sport: Sport;
  onSportClick?: (sportId: string) => void;
};

const SportItem = ({ sport, onSportClick }: Props) => {
  const { classes } = getClientTheme();
  const sidebarClasses = classes.sports_sidebar;
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const toggleExpansion = () => {
    if (sport.sportID === "pool") {
      navigate(OVERVIEW.SPORTS_POOL);

      return;
    }
    setIsExpanded(!isExpanded);
    // For now, just call the click handler
    if (onSportClick) {
      onSportClick(sport.sportID);
    }
  };

  const { data: categoriesData, isLoading: categoriesLoading } =
    useSportsCategoriesQuery(
      {
        sport_id: sport?.sportID || "",
        period: "all",
        timeoffset: "0",
      },
      { skip: !sport?.sportID || !isExpanded }
    );

  const categories = Array.isArray(categoriesData?.sports)
    ? categoriesData.sports
    : [];

  const hasEvents = sport.total > 0;

  return (
    <div
      className={`border ${classes.sports_page["date-separator-text"]}  ${sidebarClasses["sport-item-border"]} shadow-lg overflow-hidden mb-0.5`}
    >
      {/* Sport Header */}
      <div
        onClick={toggleExpansion}
        className={`flex items-center justify-between pl-2 pr-2 py-1.5 border-l-4 ${classes["border"]} shadow-lg ${sidebarClasses["sport-item-bg"]} ${sidebarClasses["sport-item-hover"]} ${sidebarClasses["sport-item-text"]} ${sidebarClasses["sport-item-border"]} ${sidebarClasses["sport-item-border-l"]}  cursor-pointer transition-colors duration-200`}
      >
        <div className="flex items-center gap-2">
          {/* Optionally add a sport icon here */}
          <span className={`text-xs font-bold tracking-wider`}>
            {sport.sportName}
          </span>
          {/* {sport.total > 0 && ( */}
          <span
            className={`text-[10px] font-semibold ${sidebarClasses["sport-item-count-text"]} ${sidebarClasses["sport-item-count-bg"]} px-1.5 py-0.5 rounded-full`}
          >
            {sport.total}
          </span>
          {/* )} */}
        </div>

        {hasEvents && (
          <IoChevronDown
            fontSize={16}
            className={`transition-transform duration-200 ease-in-out ${
              isExpanded ? "-rotate-90" : ""
            }`}
          />
        )}
      </div>

      {/* Categories Section */}
      {isExpanded && hasEvents && (
        <div>
          {categoriesLoading ? (
            <CategorySkeleton />
          ) : categories.length > 0 ? (
            <div
              className={`${sidebarClasses["category-item-bg"]} border-t ${sidebarClasses["sport-item-border"]}`}
            >
              {categories
                .filter((category) => category.categoryID)
                .map((category) => (
                  <CategoryItem
                    key={category.categoryID}
                    category={category}
                    sportId={sport.sportID}
                  />
                ))}
            </div>
          ) : (
            <div
              className={`${sidebarClasses["category-item-bg"]} border-t ${sidebarClasses["sport-item-border"]} p-3`}
            >
              <div
                className={`${sidebarClasses["category-item-text"]} text-xs text-center`}
              >
                No categories available
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SportItem;
