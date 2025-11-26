import React, { useState } from "react";
// Migrated to web/Next.js: use div, span, button, etc. with Tailwind CSS

import SideOverlay from "../SideOverlay";
import {
  useFixturesQuery,
  useSportsCategoriesQuery,
  useSportsMenuQuery,
  useTournamentsQuery,
} from "../../../store/services/bets.service";
import {
  Fixture,
  Sport,
  SportCategory,
  Tournament,
} from "../../../data/types/betting.types";
import { useAppDispatch } from "@/hooks/useAppDispatch";

type NavigationLayer = "sports" | "categories" | "tournaments" | "fixtures";

type Props = {
  onFixtureSelect?: (fixture: Fixture) => void;
  onClose: () => void;
};

const SportMenu = ({ onFixtureSelect, onClose }: Props) => {
  const [currentLayer, setCurrentLayer] = useState<NavigationLayer>("sports");
  const [selectedSport, setSelectedSport] = useState<Sport | null>(null);
  const [selectedCategory, setSelectedCategory] =
    useState<SportCategory | null>(null);
  const [selectedTournament, setSelectedTournament] =
    useState<Tournament | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const dispatch = useAppDispatch();
  // Queries for each layer
  const { data: sportsData, isLoading: sportsLoading } = useSportsMenuQuery({
    period: "all",
    start_date: "",
    end_date: "",
    timeoffset: "0",
  });
  console.log("sportsData", sportsData);

  const { data: categoriesData, isLoading: categoriesLoading } =
    useSportsCategoriesQuery(
      {
        sport_id: selectedSport?.sportID || "",
        period: "all",
        timeoffset: "0",
      },
      { skip: !selectedSport }
    );

  const { data: tournamentsData, isLoading: tournamentsLoading } =
    useTournamentsQuery(
      {
        category_id: selectedCategory?.categoryID || "",
        period: "all",
        timeoffset: "0",
        total: selectedCategory?.total.toString() || "0",
      },
      { skip: !selectedCategory }
    );

  const { data: fixturesData, isLoading: fixturesLoading } = useFixturesQuery(
    {
      tournament_id: selectedTournament?.tournamentID.toString() || "",
      sport_id: selectedSport?.sportID || "",
      period: "all",
      markets: ["1", "10", "18"],
      specifier: "",
    },
    { skip: !selectedTournament }
  );

  // Navigation handlers with loading states
  const handleSportSelect = async (sport: Sport) => {
    setIsNavigating(true);
    setSelectedSport(sport);
    setCurrentLayer("categories");
    // Reset navigation state after a short delay to allow data to load
    setTimeout(() => setIsNavigating(false), 500);
  };

  const handleCategorySelect = async (category: SportCategory) => {
    setIsNavigating(true);
    setSelectedCategory(category);
    setCurrentLayer("tournaments");
    setTimeout(() => setIsNavigating(false), 500);
  };

  const handleTournamentSelect = async (tournament: Tournament) => {
    setIsNavigating(true);
    setSelectedTournament(tournament);
    setCurrentLayer("fixtures");
    setTimeout(() => setIsNavigating(false), 500);
  };

  const handleFixtureSelect = (fixture: Fixture) => {
    if (onFixtureSelect) {
      onFixtureSelect(fixture);
    }
    if (onClose) {
      onClose();
    }
  };

  const handleBack = () => {
    setIsNavigating(true);
    switch (currentLayer) {
      case "categories":
        setCurrentLayer("sports");
        setSelectedSport(null);
        break;
      case "tournaments":
        setCurrentLayer("categories");
        setSelectedCategory(null);
        break;
      case "fixtures":
        setCurrentLayer("tournaments");
        setSelectedTournament(null);
        break;
    }
    setTimeout(() => setIsNavigating(false), 300);
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  // Loading component
  const LoadingView = ({ message }: { message: string }) => (
    <div className="flex-1 h-full flex flex-col justify-center items-center bg-gray-900 min-h-[200px]">
      <span className="w-8 h-8 mb-4 border-4 border-green-500 border-t-transparent rounded-full animate-spin inline-block" />
      <span className="text-white text-lg mt-4 font-semibold">{message}</span>
      <span className="text-gray-400 text-sm mt-2">Please wait...</span>
    </div>
  );

  // Render functions for each layer
  const renderSports = () => (
    <div className="h-[80vh] overflow-y-scroll">
      <div className="p-4">
        <div className="flex flex-row flex-wrap justify-between">
          {sportsData?.sports?.map((sport) => (
            <button
              key={sport.sportID}
              type="button"
              onClick={() => handleSportSelect(sport)}
              className="w-[24%] bg-gray-700 rounded-lg p-4 mb-3 hover:bg-gray-600 transition"
              disabled={isNavigating}
            >
              <div className="text-white text-lg font-semibold mb-2">
                {sport.sportName}
              </div>
              <div className="text-gray-300 text-sm">{sport.total} events</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCategories = () => (
    <div className="h-[80vh] overflow-y-scroll">
      <div className="p-4">
        <div className="flex flex-row items-center mb-4">
          <button
            type="button"
            onClick={handleBack}
            className="mr-3 p-2 bg-gray-600 rounded-lg"
            disabled={isNavigating}
          >
            <span className="text-white text-lg">←</span>
          </button>
          <span className="text-white text-xl font-bold">
            {selectedSport?.sportName} - Categories
          </span>
        </div>

        <div className="flex flex-row flex-wrap justify-between">
          {categoriesData?.sports?.map((category, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleCategorySelect(category)}
              className="w-[24%] bg-gray-700 rounded-lg p-4 mb-3 hover:bg-gray-600 transition"
              disabled={isNavigating}
            >
              <div className="text-white text-lg font-semibold mb-2">
                {category.categoryName}
              </div>
              <div className="text-gray-300 text-sm">
                {category.total} tournaments
              </div>
              {category.code && (
                <div className="text-blue-400 text-xs mt-1">
                  Code: {category.code}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTournaments = () => (
    <div className="h-[80vh] overflow-y-scroll">
      <div className="p-4">
        <div className="flex flex-row items-center mb-4">
          <button
            type="button"
            onClick={handleBack}
            className="mr-3 p-2 bg-gray-600 rounded-lg"
            disabled={isNavigating}
          >
            <span className="text-white text-lg">←</span>
          </button>
          <div className="flex-1">
            <span className="text-white text-xl font-bold">
              {selectedSport?.sportName}
            </span>
            <div className="text-gray-300 text-sm">
              {selectedCategory?.categoryName} - Tournaments
            </div>
          </div>
        </div>

        <div className="flex flex-row flex-wrap justify-between">
          {tournamentsData?.sports?.map((tournament, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleTournamentSelect(tournament)}
              className="w-[24%] bg-gray-700 rounded-lg p-4 mb-3 hover:bg-gray-600 transition"
              disabled={isNavigating}
            >
              <div className="text-white text-lg font-semibold mb-2">
                {tournament.tournamentName}
              </div>
              <div className="text-gray-300 text-sm">
                {tournament.total} fixtures
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderFixtures = () => (
    <div className="h-[80vh] overflow-y-scroll">
      <div className="p-4">
        <div className="flex flex-row items-center mb-4">
          <button
            type="button"
            onClick={handleBack}
            className="mr-3 p-2 bg-gray-600 rounded-lg"
            disabled={isNavigating}
          >
            <span className="text-white text-lg">←</span>
          </button>
          <div className="flex-1">
            <span className="text-white text-xl font-bold">
              {selectedTournament?.tournamentName}
            </span>
            <div className="text-gray-300 text-sm">
              {selectedSport?.sportName} - {selectedCategory?.categoryName}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {fixturesData?.fixtures?.map((fixture, index) => (
            <button
              key={index}
              type="button"
              // onClick={() => handleFixtureSelect(fixture)}
              onClick={() => {}}
              className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition"
              disabled={isNavigating}
            >
              <div className="text-white text-lg font-semibold mb-2">
                {fixture.name}
              </div>
              <div className="text-gray-300 text-sm mb-1">
                {fixture.date} • {fixture.eventTime}
              </div>
              <div className="text-gray-400 text-xs">
                {fixture.matchStatus} • {fixture.outcomes.length} betting
                options
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // Show loading state during navigation or data fetching
  const isLoading =
    (currentLayer === "sports" && sportsLoading) ||
    (currentLayer === "categories" && categoriesLoading) ||
    (currentLayer === "tournaments" && tournamentsLoading) ||
    (currentLayer === "fixtures" && fixturesLoading);

  if (isNavigating || isLoading) {
    const loadingMessages = {
      sports: "Loading sports...",
      categories: "Loading categories...",
      tournaments: "Loading tournaments...",
      fixtures: "Loading fixtures...",
    };

    return <LoadingView message={loadingMessages[currentLayer]} />;
  }

  // Render current layer
  const renderCurrentLayer = () => {
    switch (currentLayer) {
      case "sports":
        return renderSports();
      case "categories":
        return renderCategories();
      case "tournaments":
        return renderTournaments();
      case "fixtures":
        return renderFixtures();
      default:
        return renderSports();
    }
  };

  return (
    <SideOverlay open={true} onOpenChange={() => onClose()} width="1400px">
      {renderCurrentLayer()}
    </SideOverlay>
  );
};

export default SportMenu;
