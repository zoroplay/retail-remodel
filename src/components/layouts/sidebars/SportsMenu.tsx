import SingleSearchInput from "@/components/inputs/SingleSearchInput";
import {
  SelectedMarket,
  Sport,
  SportCategory,
} from "@/data/types/betting.types";
import {
  usePoolFixturesQuery,
  useQueryFixturesMutation,
  useSportsMenuQuery,
} from "@/store/services/bets.service";
import React, { useEffect, useState } from "react";
import SportItem from "./SportItem";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import {
  setRefresh,
  setTournamentDetails,
} from "@/store/features/slice/app.slice";
import { useNavigate } from "react-router-dom";
import { OVERVIEW } from "@/data/routes/routes";
import { getClientTheme } from "@/config/theme.config";
import {
  addCashDeskFixtures,
  setCashDeskLoading,
} from "@/store/features/slice/fixtures.slice";
import { PreMatchFixture } from "@/store/features/types/fixtures.types";

type Props = {};

const SportsMenu = (props: Props) => {
  const { data: sportsData, isLoading: sportsLoading } = useSportsMenuQuery({
    period: "all",
    start_date: "",
    end_date: "",
    timeoffset: "0",
  });
  const dispatch = useAppDispatch();
  const [queryFixtures, { isLoading, data }] = useQueryFixturesMutation();

  // Helper to get ISO week number
  function getWeekNumber(date: Date): number {
    const tempDate = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
    const dayNum = tempDate.getUTCDay() || 7;
    tempDate.setUTCDate(tempDate.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(tempDate.getUTCFullYear(), 0, 1));
    return Math.ceil(
      ((tempDate.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
    );
  }

  const { data: poolData } = usePoolFixturesQuery({
    week: getWeekNumber(new Date()),
    year: new Date().getFullYear(),
  });
  const navigate = useNavigate();
  const pathname = window.location.pathname;

  const sports_data: Sport[] = Array.isArray(sportsData?.sports)
    ? [
        {
          sportID: "pool",
          sportName: "Pool Games",
          total: Number(poolData?.total || 0),
        },
        ...sportsData?.sports,
      ]
    : [];
  // Sidebar navigation state
  const [selectedSport, setSelectedSport] = useState<Sport | null>(null);
  const [selectedCategory, setSelectedCategory] =
    useState<SportCategory | null>(null);
  const [selectedTournament, setSelectedTournament] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  // Handle sport selection
  const handleSportClick = (sportId: string) => {
    const sport =
      sports_data.find((s: Sport) => String(s.sportID) === sportId) || null;
    setSelectedSport(sport);
    setSelectedCategory(null);
    setSelectedTournament(null);
  };

  // When a sport is selected, show categories
  const handleSportSelect = (sportId: string) => {
    const sport =
      sportsData?.sports?.find((s: Sport) => String(s.sportID) === sportId) ||
      null;
    setSelectedSport(sport);
    setSelectedCategory(null);
    setSelectedTournament(null);
  };

  // Back navigation
  const handleSidebarBack = () => {
    if (selectedTournament) {
      setSelectedTournament(null);
    } else if (selectedCategory) {
      setSelectedCategory(null);
    } else if (selectedSport) {
      setSelectedSport(null);
    }
  };

  useEffect(() => {
    // Reset selections when search query changes
    if (searchQuery.trim() === "") {
      dispatch(setTournamentDetails({ query: "" }));
    }
  }, [searchQuery]);
  const { classes } = getClientTheme();

  return (
    <section className="sticky top-[100px]">
      <aside
        className={`lg:w-72 w-full ${
          classes.sports_sidebar["main-bg"]
        } border-b ${classes.sports_sidebar["card-border"].replace(
          "border-",
          "border-l"
        )} overflow-hidden shadow-2xl`}
      >
        <div className="flex-1 items-center justify-center gap-2 p-2">
          {/* Restore SingleSearchInput at the top */}
          <SingleSearchInput
            placeholder={"Search Event"}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (e.target.value.trim() === "") {
                dispatch(setTournamentDetails({ query: "" }));
                dispatch(setRefresh());
                return;
              } else if (e.target.value.trim().length > 3) {
                return;
              }
            }}
            onSearch={(query) => {
              if (pathname === OVERVIEW.CASHDESK) {
                dispatch(setCashDeskLoading());

                queryFixtures(query)
                  .unwrap()
                  .then((response) => {
                    dispatch(
                      addCashDeskFixtures({
                        fixtures: (response?.fixtures ??
                          []) as unknown as PreMatchFixture[],
                        selectedMarket: (response?.markets ||
                          []) as unknown as SelectedMarket[],
                        sport_id:
                          Number(
                            response?.markets.find((market) => market.sportID)
                              ?.sportID
                          ) || 0,
                      })
                    );
                  });
              } else {
                queryFixtures(query);
                dispatch(setTournamentDetails({ query }));
                if (window.location.pathname.includes("sports") === false) {
                  navigate(OVERVIEW.HOME);
                }
              }
            }}
            searchState={{
              isValid: false,
              isNotFound: false,
              isLoading,
              message: "",
            }}
            height="h-[36px]"
            bg_color={classes["input-bg"]}
            text_color={`${classes["input-text"]} text-xs`}
            border_color={`border ${classes["input-border"]}`}
          />
          <div
            className={`w-full rounded-lg h-0.5 ${classes.sports_sidebar["divider"]} my-1.5`}
          />
          {/* Sports List */}
          <div className=" max-h-[calc(100vh-175px)] pr-1 overflow-y-auto h-full">
            {sportsLoading ? (
              <div className="flex flex-col gap-1">
                {[...Array(8)].map((_, index) => (
                  <div
                    key={index}
                    className={`${classes.sports_sidebar["item-bg"]} rounded-lg p-2 animate-pulse`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-6 h-6 ${classes["skeleton-bg"]} rounded`}
                      />
                      <div className="flex-1 space-y-1.5">
                        <div
                          className={`h-3 ${classes["skeleton-bg"]} rounded w-3/4`}
                        />
                        <div
                          className={`h-2 ${classes["skeleton-bg"]} rounded w-1/2`}
                        />
                      </div>
                      <div
                        className={`w-5 h-5 ${classes["skeleton-bg"]} rounded-full`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : sports_data.length > 0 ? (
              sports_data.map((sport) => (
                <SportItem
                  key={sport.sportID}
                  sport={sport}
                  onSportClick={handleSportClick}
                />
              ))
            ) : (
              <div className="text-gray-400 text-center py-4">
                No sports available
              </div>
            )}
          </div>
        </div>
      </aside>
    </section>
  );
};

export default SportsMenu;
