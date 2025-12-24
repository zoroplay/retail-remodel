import { getClientTheme } from "@/config/theme.config";
import { Fixture, SelectedMarket } from "@/data/types/betting.types";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useModal } from "@/hooks/useModal";
import { setSelectedGame } from "@/store/features/slice/fixtures.slice";
import { MODAL_COMPONENTS } from "@/store/features/types";
import { PreMatchFixture } from "@/store/features/types/fixtures.types";
import React, { useCallback } from "react";
import OddsButton from "../buttons/OddsButton";
import { useBetting } from "@/hooks/useBetting";
import { ChevronRight } from "lucide-react";

type Props = {
  fixture: PreMatchFixture | Fixture;
  selectedMarkets: SelectedMarket[];
};

const FixtureItem = ({ fixture, selectedMarkets }: Props) => {
  const dispatch = useAppDispatch();
  const { openModal } = useModal();
  const { classes } = getClientTheme();
  const sportsPageClasses = classes.sports_page;
  const { selected_bets } = useBetting();
  const handleMorePress = useCallback(
    (game: PreMatchFixture) => {
      dispatch(setSelectedGame(game));
      openModal({
        modal_name: MODAL_COMPONENTS.GAME_OPTIONS,
        title: "Menu",
        ref: game.gameID,
      });
    },
    [openModal]
  );
  const getMarketOutcomes = (fixture: any, marketConfig: SelectedMarket) => {
    return marketConfig.outcomes
      .map((expectedOutcome: any) => {
        return fixture?.outcomes?.find(
          (outcome: any) =>
            outcome.marketID.toString() === marketConfig.marketID &&
            outcome.outcomeID.toString() ===
              expectedOutcome.outcomeID.toString()
        );
      })
      .filter(Boolean); // Remove undefined outcomes
  };
  return (
    <div
      className={`grid grid-cols-[repeat(17,minmax(0,1fr))] gap-1 p-2 ${
        sportsPageClasses["card-hover"]
      } transition-colors duration-200 cursor-pointer border-l-4 ${
        classes["item-hover-border-l"]
      } border-b !${sportsPageClasses["card-border"].replace(
        "border-",
        "border-b-"
      )}`}
    >
      {/* Time */}
      <div
        className={`col-span-2 ${sportsPageClasses["time-border"]} border-r flex flex-col items-start justify-center`}
      >
        <span
          className={`text-[11px] font-semibold ${sportsPageClasses["time-text"]}`}
        >
          {fixture.eventTime}
        </span>

        <span
          className={`text-[11px] ${sportsPageClasses["match-tournament-text"]} whitespace-nowrap`}
        >
          ID: {fixture.matchID}
        </span>
      </div>

      {/* Match Info */}
      <div className="col-span-6 flex flex-col justify-center">
        {/* <div
          className={`text-[10px] ${sportsPageClasses["match-tournament-text"]} mb-1`}
        >
          {fixture.tournament} • {fixture.categoryName}
        </div> */}
        <div
          className={`text-[13px] font-semibold ${sportsPageClasses["match-team-text"]}`}
        >
          {fixture.homeTeam}
        </div>
        <div
          className={`text-sm font-semibold ${sportsPageClasses["match-team-text"]}`}
        >
          vs
        </div>
        <div
          className={`text-[13px] font-semibold ${sportsPageClasses["match-team-text"]}`}
        >
          {fixture.awayTeam}
        </div>
      </div>

      {/* Dynamic Market Outcomes */}
      {selectedMarkets.map((marketConfig, marketIndex) => {
        const marketOutcomes = getMarketOutcomes(fixture, marketConfig);

        return (
          <div
            key={marketConfig.marketID}
            className="col-span-4 flex items-center justify-center"
          >
            {marketConfig.outcomes.map((expectedOutcome, outcomeIndex) => {
              const foundOutcome = marketOutcomes.find(
                (outcome: any) =>
                  outcome?.outcomeID.toString() ===
                  expectedOutcome.outcomeID.toString()
              );

              const isFirst = outcomeIndex === 0;
              const isLast = outcomeIndex === marketConfig.outcomes.length - 1;
              let rounded = "";
              if (isFirst) rounded = "rounded-l-md";
              else if (isLast) rounded = "rounded-r-md";

              return (
                <OddsButton
                  key={`${marketConfig.marketID}-${expectedOutcome.outcomeID}`}
                  outcome={foundOutcome!}
                  game_id={Number(fixture.gameID)}
                  fixture_data={fixture as PreMatchFixture}
                  height={"h-10"}
                  disabled={!foundOutcome}
                  rounded={rounded}
                />
              );
            })}
          </div>
        );
      })}

      <div className="col-span-1 ml-2 px-2 flex items-center justify-center relative">
        <div
          onClick={(e) => {
            e.stopPropagation();
            handleMorePress(fixture as PreMatchFixture);
          }}
          className={`text-[10px] flex justify-center items-center h-10 rounded-md w-12 p-1   ${
            classes["odds-button-hover"]
          } shadow font-semibold transition-colors border-2 ${
            selected_bets.some(
              (bet) =>
                bet.game &&
                (bet.game.matchID == Number(fixture.matchID) ||
                  bet.game.game_id == Number(fixture.gameID))
            )
              ? `${classes["odds-button-selected-bg"]}   ${classes["odds-button-selected-text"]} ${classes["odds-button-selected-border"]}`
              : `${classes["odds-button-border"]} ${classes["odds-button-bg"]} ${classes["odds-button-text"]}`
          }`}
        >
          <span>+{fixture.activeMarkets || 0}</span>
          <ChevronRight size={12} />
        </div>
      </div>
    </div>
  );
};

export default FixtureItem;
