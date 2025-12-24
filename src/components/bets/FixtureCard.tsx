import { getClientTheme } from "@/config/theme.config";
import { PreMatchFixture } from "@/store/features/types/fixtures.types";
import React from "react";
import FixtureItem from "./FixtureItem";
import { SelectedMarket } from "@/data/types/betting.types";
import { TfiLineDouble } from "react-icons/tfi";

type Props = {
  fixtures: PreMatchFixture[];
  selectedMarkets: SelectedMarket[];
};

const FixtureCard = ({ fixtures, selectedMarkets }: Props) => {
  const { classes } = getClientTheme();
  const sportsPageClasses = classes.sports_page;
  return (
    <>
      {Object.entries(
        fixtures.reduce(
          (
            dateGroups: Record<string, Record<string, typeof fixtures>>,
            fixture
          ) => {
            const fixtureDate = new Date(
              fixture.date || fixture.eventTime
            ).toLocaleDateString("en-GB", {
              weekday: "short",
              day: "numeric",
              month: "short",
            });
            const category = fixture.categoryName || "Unknown Category";
            const tournament = fixture.tournament || "Unknown Tournament";
            const tournamentKey = `${category}|||${tournament}`;
            if (!dateGroups[fixtureDate]) {
              dateGroups[fixtureDate] = {};
            }
            if (!dateGroups[fixtureDate][tournamentKey]) {
              dateGroups[fixtureDate][tournamentKey] = [];
            }
            dateGroups[fixtureDate][tournamentKey].push(fixture);
            return dateGroups;
          },
          {}
        )
      ).map(([date, tournaments]) => (
        <div key={date}>
          {/* <div
            className={`${sportsPageClasses["date-separator-bg"]} px-6 py-1 border-b ${sportsPageClasses["date-separator-border"]}`}
          >
            <h3
              className={`${sportsPageClasses["date-separator-text"]} font-medium text-xs uppercase tracking-wide`}
            >
              {date}
            </h3>
          </div> */}
          {Object.entries(tournaments).map(([tournamentKey, fixtures]) => {
            const [category, tournament] = tournamentKey.split("|||");
            return (
              <div key={tournamentKey} className="">
                <div
                  className={`${sportsPageClasses["date-separator-bg"]} px-8 py-1 border-b ${sportsPageClasses["date-separator-border"]} flex justify-start items-center gap-2 mb-1`}
                >
                  <h3
                    className={`${sportsPageClasses["date-separator-text"]} font-medium text-[11px] uppercase tracking-wide`}
                  >
                    {date}
                  </h3>{" "}
                  <div
                    className={`${sportsPageClasses["date-separator-text"]} rotate-90`}
                  >
                    <TfiLineDouble />
                  </div>
                  <h4
                    className={`${sportsPageClasses["date-separator-text"]} font-medium text-[10px] uppercase tracking-wide`}
                  >
                    {category} • {tournament}
                  </h4>
                </div>
                {fixtures.map((fixture) => (
                  <FixtureItem
                    key={fixture.matchID || fixture.gameID}
                    fixture={fixture}
                    selectedMarkets={selectedMarkets}
                  />
                ))}
              </div>
            );
          })}
        </div>
      ))}
    </>
  );
};

export default FixtureCard;
