import React, { useState, useMemo } from "react";
import { PreMatchFixture } from "@/store/features/types/fixtures.types";
import { SkeletonCard } from "@/components/skeletons/OutComesSkeleton";
import {
  IoChevronForward,
  IoChevronDown,
  IoInformationCircleOutline,
  IoPersonOutline,
  IoSearch,
} from "react-icons/io5";
import OddsButton from "@/components/buttons/OddsButton";
import { getClientTheme } from "@/config/theme.config";

type Props = {
  fixture_data: PreMatchFixture;
  disabled?: boolean;
  is_loading?: boolean;
  market_id: number;
};

const FirstGoalScorer = ({
  fixture_data,
  disabled,
  is_loading,
  market_id,
}: Props) => {
  const [is_collapsed, setIsCollapsed] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<"odds" | "name">("odds");
  const theme = getClientTheme();
  const marketClasses = theme.classes.game_options_modal;

  const outcomes =
    fixture_data?.outcomes?.filter(
      (outcome) => (outcome.marketID || outcome.marketId) === market_id
    ) || [];

  const title =
    outcomes.find((item) => !!item.marketName)?.marketName ||
    "First Goal Scorer";

  if (is_loading) return <SkeletonCard title={title} />;
  if (outcomes.length === 0) return null;

  // Separate "no goal" option from players
  const noGoalOutcome = outcomes.find(
    (outcome) =>
      outcome.outcomeName?.toLowerCase().includes("no goal") ||
      outcome.outcomeID === "1716"
  );

  const playerOutcomes = outcomes.filter(
    (outcome) =>
      !outcome.outcomeName?.toLowerCase().includes("no goal") &&
      outcome.outcomeID !== "1716"
  );

  // Filter and sort players
  const filteredAndSortedPlayers = useMemo(() => {
    let filtered = playerOutcomes;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((player) =>
        player.outcomeName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      if (sortBy === "odds") {
        return (a.odds || 0) - (b.odds || 0);
      } else {
        const nameA = a.outcomeName || "";
        const nameB = b.outcomeName || "";
        return nameA.localeCompare(nameB);
      }
    });
  }, [playerOutcomes, searchTerm, sortBy]);

  // Group players by odds ranges for better organization
  const oddsGroups = useMemo(() => {
    const groups = {
      favorites: filteredAndSortedPlayers.filter((p) => p.odds && p.odds <= 3),
      likely: filteredAndSortedPlayers.filter(
        (p) => p.odds && p.odds > 3 && p.odds <= 7
      ),
      possible: filteredAndSortedPlayers.filter(
        (p) => p.odds && p.odds > 7 && p.odds <= 15
      ),
      longshots: filteredAndSortedPlayers.filter((p) => p.odds && p.odds > 15),
    };
    return groups;
  }, [filteredAndSortedPlayers]);

  const formatPlayerName = (name: string) => {
    if (name.includes(",")) {
      const parts = name.split(",");
      return `${parts[1]?.trim()} ${parts[0]?.trim()}`;
    }
    return name;
  };

  const renderPlayerGroup = (
    players: any[],
    groupTitle: string,
    groupColor: string
  ) => {
    if (players.length === 0) return null;

    return (
      <div className="mb-4">
        <div
          className={`text-xs font-medium mb-2 ${groupColor} flex items-center gap-2`}
        >
          <span>{groupTitle}</span>
          <span className="bg-gray-600 text-gray-300 px-2 py-0.5 rounded-full text-xs">
            {players.length}
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1">
          {players.map((outcome) => {
            const displayName = formatPlayerName(
              outcome.outcomeName || "Unknown Player"
            );

            return (
              <OddsButton
                key={outcome.outcomeID}
                outcome={{
                  ...outcome,
                  outcomeName: displayName,
                  displayName: displayName, // Ensure displayName is also set
                }}
                game_id={fixture_data?.gameID as unknown as number}
                fixture_data={fixture_data}
                show_display_name={true}
                bg_color={"bg-white text-black"}
                height="h-10"
                disabled={disabled}
                rounded="rounded-md"
              />
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div
      className={`shadow-2xl ${marketClasses["market-card-bg"]} ${marketClasses["market-card-border"]} border rounded-md p-1 pb-2 ${marketClasses["market-card-hover"]}`}
    >
      <div className="">
        <button
          className="w-full flex items-center justify-between px-2 py-1 text-left"
          onClick={() => setIsCollapsed((prev) => !prev)}
          type="button"
        >
          <div className="flex items-center gap-2">
            {is_collapsed ? (
              <IoChevronForward
                size={18}
                className={marketClasses["market-title"]}
              />
            ) : (
              <IoChevronDown
                size={18}
                className={marketClasses["market-title"]}
              />
            )}
            <span
              className={`font-semibold text-xs ${marketClasses["market-title"]}`}
            >
              {title}
            </span>
            <IoInformationCircleOutline
              size={16}
              className={`ml-1 ${marketClasses["subtitle-text"]}`}
            />
          </div>
        </button>

        {!is_collapsed && (
          <div className="px-2 space-y-2">
            {/* No Goal option at the top */}
            {noGoalOutcome && (
              <div className="">
                <div className="text-xs text-gray-400 mb-1 font-medium">
                  Special
                </div>
                <OddsButton
                  key={noGoalOutcome.outcomeID}
                  outcome={noGoalOutcome}
                  game_id={fixture_data?.gameID as unknown as number}
                  fixture_data={fixture_data}
                  show_display_name={true}
                  bg_color={
                    "bg-red-900/50 text-red-200 border border-red-700/50"
                  }
                  height="h-10"
                  disabled={disabled}
                  rounded="rounded-md"
                />
              </div>
            )}

            {/* Search and Filter Controls */}
            <div className="space-y-2 border-t border-gray-600 pt-3">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <IoSearch size={14} />
                <span>Players ({playerOutcomes.length})</span>
              </div>

              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Search players..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-2 py-1 text-xs bg-gray-800 border border-gray-600 rounded text-gray-300 placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "odds" | "name")}
                  className="px-2 py-1 text-xs bg-gray-800 border border-gray-600 rounded text-gray-300 focus:outline-none focus:border-blue-500"
                >
                  <option value="odds">Sort by Odds</option>
                  <option value="name">Sort by Name</option>
                </select>
              </div>
            </div>

            {/* Players organized by odds groups */}
            {sortBy === "odds" && !searchTerm ? (
              <div className="space-y-4">
                {renderPlayerGroup(
                  oddsGroups.favorites,
                  "Favorites",
                  "text-green-400"
                )}
                {renderPlayerGroup(
                  oddsGroups.likely,
                  "Likely",
                  "text-yellow-400"
                )}
                {renderPlayerGroup(
                  oddsGroups.possible,
                  "Possible",
                  "text-orange-400"
                )}
                {renderPlayerGroup(
                  oddsGroups.longshots,
                  "Long Shots",
                  "text-red-400"
                )}
              </div>
            ) : (
              /* All players in simple grid for name sorting or search results */
              <div className="">
                {filteredAndSortedPlayers.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1">
                    {filteredAndSortedPlayers.map((outcome) => {
                      const displayName = formatPlayerName(
                        outcome.outcomeName || "Unknown Player"
                      );

                      return (
                        <OddsButton
                          key={outcome.outcomeID}
                          outcome={{
                            ...outcome,
                            outcomeName: displayName,
                            displayName: displayName, // Ensure displayName is also set
                          }}
                          game_id={fixture_data?.gameID as unknown as number}
                          fixture_data={fixture_data}
                          show_display_name={true}
                          bg_color={"bg-white text-black"}
                          height="h-10"
                          disabled={disabled}
                          rounded="rounded-md"
                        />
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-4">
                    No players found matching "{searchTerm}"
                  </div>
                )}
              </div>
            )}

            {/* Summary footer */}
            <div className="text-xs text-gray-500 text-center pt-2 border-t border-gray-600">
              {searchTerm
                ? `${filteredAndSortedPlayers.length} of ${playerOutcomes.length} players shown`
                : `${outcomes.length} total options available`}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FirstGoalScorer;
