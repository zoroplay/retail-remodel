import React from "react";
import { Tournament } from "@/data/types/betting.types";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { setTournamentDetails } from "@/store/features/slice/app.slice";
import { useNavigate } from "react-router-dom";
import { OVERVIEW } from "@/data/routes/routes";
import { getSportRoute } from "@/data/routes/routeUtils";
import { getClientTheme } from "@/config/theme.config";

type Props = {
  tournament: Tournament;
  categoryId: string;
  sportId: string;
};

const TournamentItem = ({ tournament, categoryId, sportId }: Props) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { classes } = getClientTheme();
  const sidebarClasses = classes.sports_sidebar;
  const handleTournamentClick = () => {
    dispatch(
      setTournamentDetails({
        tournament_id: tournament.tournamentID,
        sport_id: Number(sportId) || undefined,
        category_id: Number(categoryId) || undefined,
      })
    );

    navigate(getSportRoute(sportId));
  };

  return (
    <div
      onClick={handleTournamentClick}
      className={`p-2 pl-6 ${sidebarClasses["tournament-item-text"]} ${sidebarClasses["tournament-item-hover"]} cursor-pointer transition-colors duration-200 border-b ${sidebarClasses["tournament-item-border"]} last:border-b-0`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] tracking-wide">
          {tournament.tournamentName}
        </span>
        {tournament.total > 0 && (
          <span
            className={`text-xs ${sidebarClasses["tournament-item-count-text"]} ${sidebarClasses["tournament-item-count-bg"]} px-1.5 py-0.5 rounded-full`}
          >
            {tournament.total}
          </span>
        )}
      </div>
    </div>
  );
};

export default TournamentItem;
