import React from "react";
import {
  Sport,
  SportCategory,
  Tournament,
} from "../../../data/types/betting.types";
import { useTournamentsQuery } from "../../../store/services/bets.service";
import Spinner from "../../layouts/Spinner";
// Migrated to web/Next.js: use div, span, button, etc. with Tailwind CSS

type Props = {
  selectedSport: Sport;
  selectedCategory: SportCategory;
  onTournamentSelect?: (tournament: Tournament) => void;
  onBack?: () => void;
};

const TournamentMenu = ({
  selectedSport,
  selectedCategory,
  onTournamentSelect,
  onBack,
}: Props) => {
  const { data, isLoading } = useTournamentsQuery({
    category_id: selectedCategory.categoryID,
    period: "all",
    timeoffset: "0",
    total: selectedCategory.total.toString(),
  });

  const handleTournamentPress = (tournament: Tournament) => {
    if (onTournamentSelect) {
      onTournamentSelect(tournament);
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4">
        {/* Header with back button */}
        <div className="flex flex-row items-center mb-4">
          <button
            type="button"
            onClick={onBack}
            className="mr-3 p-2 bg-gray-600 rounded-lg"
          >
            <span className="text-white text-lg">←</span>
          </button>
          <div className="flex-1">
            <span className="text-white text-xl font-bold">
              {selectedSport.sportName}
            </span>
            <div className="text-gray-300 text-sm">
              {selectedCategory.categoryName} - Tournaments
            </div>
          </div>
        </div>

        <div className="flex flex-row flex-wrap justify-between">
          {data?.sports?.map((tournament) => (
            <button
              key={tournament.tournamentID}
              type="button"
              onClick={() => handleTournamentPress(tournament)}
              className="w-[48%] bg-gray-700 rounded-lg p-4 mb-3 hover:bg-gray-600 transition"
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
};

export default TournamentMenu;
