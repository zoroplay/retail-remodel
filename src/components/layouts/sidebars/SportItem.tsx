import React, { useState } from "react";
import { Sport } from "@/data/types/betting.types";
import { useSportsCategoriesQuery } from "@/store/services/bets.service";
import CategoryItem from "./CategoryItem";
import CategorySkeleton from "./CategorySkeleton";
import { getClientTheme } from "@/config/theme.config";

type Props = {
  sport: Sport;
  onSportClick?: (sportId: string) => void;
};

const SportItem = ({ sport, onSportClick }: Props) => {
  const { classes } = getClientTheme();
  const sidebarClasses = classes.sports_sidebar;
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpansion = () => {
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
    <div className={`border ${sidebarClasses["sport-item-border"]} `}>
      {/* Sport Header */}
      <div
        onClick={toggleExpansion}
        className={`flex items-center justify-between p-2 py-1.5   ${sidebarClasses["sport-item-bg"]} ${sidebarClasses["sport-item-hover"]} cursor-pointer transition-colors duration-200`}
      >
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-semibold ${sidebarClasses["sport-item-text"]} tracking-wider`}
          >
            {sport.sportName}
          </span>
          {sport.total > 0 && (
            <span
              className={`text-xs font-semibold ${sidebarClasses["sport-item-count-text"]} ${sidebarClasses["sport-item-count-bg"]} px-2 py-0.5 rounded-full`}
            >
              {sport.total}
            </span>
          )}
        </div>

        {hasEvents && (
          <div className="transition-transform duration-200">
            {isExpanded ? "▼" : "▶"}
          </div>
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
              {categories.map((category) => (
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
