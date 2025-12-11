import React, { useState } from "react";
import { SportCategory } from "@/data/types/betting.types";
import { useTournamentsQuery } from "@/store/services/bets.service";
import TournamentItem from "./TournamentItem";
import TournamentSkeleton from "./TournamentSkeleton";
import { getClientTheme } from "@/config/theme.config";
import { IoChevronDown } from "react-icons/io5";
import CategorySkeleton from "./CategorySkeleton";

type Props = {
  category: SportCategory;
  sportId: string;
};

const CategoryItem = ({ category, sportId }: Props) => {
  const { classes } = getClientTheme();
  const sidebarClasses = classes.sports_sidebar;
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  const { data: tournamentsData, isLoading: tournamentsLoading } =
    useTournamentsQuery(
      {
        category_id: category?.categoryID || "",
        period: "all",
        timeoffset: "0",
        total: category?.total.toString() || "0",
      },
      { skip: !category?.categoryID || !isExpanded }
    );

  const tournaments = Array.isArray(tournamentsData?.sports)
    ? tournamentsData.sports
    : [];

  const hasTournaments = category.total > 0;

  return (
    <div
      className={`border-b ${sidebarClasses["tournament-item-border"]} last:border-b-0`}
    >
      {/* Category Header */}
      <div
        onClick={toggleExpansion}
        className={`flex items-center justify-between p-2 py-1.5 pl-4 ${sidebarClasses["category-item-text"]} ${sidebarClasses["category-item-hover"]} cursor-pointer transition-colors duration-200`}
      >
        <div className="flex items-center gap-2">
          <span className="text-xs tracking-wider">
            {category.categoryName}
          </span>
          {hasTournaments && (
            <span
              className={`text-[10px] ${sidebarClasses["category-item-count-text"]} ${sidebarClasses["category-item-count-bg"]} px-2 py-0.5 rounded-full`}
            >
              {category.total}
            </span>
          )}
        </div>

        {hasTournaments && (
          // <div className="transition-transform duration-200 text-sm">
          //   {isExpanded ? "▼" : "▶"}
          // </div>
          <IoChevronDown
            fontSize={14}
            className={`transition-transform duration-200 ease-in-out ${
              isExpanded ? "-rotate-90" : ""
            }`}
          />
        )}
      </div>

      {/* Tournaments Section */}
      {isExpanded && hasTournaments && (
        <div>
          {tournamentsLoading ? (
            <TournamentSkeleton />
          ) : tournaments.length > 0 ? (
            <div className={sidebarClasses["tournament-item-bg"]}>
              {tournaments.map((tournament) => (
                <TournamentItem
                  key={tournament.tournamentID}
                  tournament={tournament}
                  categoryId={category.categoryID}
                  sportId={sportId}
                />
              ))}
            </div>
          ) : (
            <div className={`${sidebarClasses["tournament-item-bg"]} p-3 pl-8`}>
              <div
                className={`${sidebarClasses["tournament-item-text"]} text-xs text-center`}
              >
                No tournaments available
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryItem;
