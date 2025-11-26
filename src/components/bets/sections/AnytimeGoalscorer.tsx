import React, { useState, useMemo } from "react";
import { PreMatchFixture } from "@/store/features/types/fixtures.types";
import { SkeletonCard } from "@/components/skeletons/OutComesSkeleton";
import {
  IoChevronForward,
  IoChevronDown,
  IoInformationCircleOutline,
  IoFootball,
  IoSearch,
  IoFunnel,
  IoPersonOutline,
} from "react-icons/io5";
import OddsButton from "@/components/buttons/OddsButton";
import { getClientTheme } from "@/config/theme.config";

type Props = {
  fixture_data: PreMatchFixture;
  disabled?: boolean;
  is_loading?: boolean;
  market_id: number;
};

const AnytimeGoalscorer = ({
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

  // Determine market type and set appropriate title and icon
  const isFirstGoalScorer = market_id === 38;
  const title =
    outcomes?.[0]?.marketName ||
    (isFirstGoalScorer ? "First Goal Scorer" : "Anytime Goalscorer");

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

  const renderPlayerGroup = (players: any[], groupTitle: string) => {
    if (players.length === 0) return null;

    return (
      <div className="mb-4 flex flex-col gap-2">
        <div
          className={`text-xs font-medium w-full flex items-center justify-between gap-2`}
        >
          <span>{groupTitle}</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ">
          {players.map((outcome, index) => {
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
                // bg_color={"bg-white text-black"}
                height="h-12"
                disabled={disabled}
                rounded={`${
                  index === 0
                    ? "rounded-tl-md"
                    : index === 2
                    ? "rounded-tr-md"
                    : (players?.length % 2 == 0 && players?.length - 2) ===
                      index
                    ? "rounded-bl-md"
                    : (players?.length % 2 !== 0 && players?.length - 3) ===
                      index
                    ? "rounded-bl-md"
                    : players?.length - 1 === index
                    ? "rounded-br-md"
                    : ""
                }`}
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
          <div className="px-2 space-y-3">
            {/* Players organized by odds groups */}
            {sortBy === "odds" && !searchTerm ? (
              <div className=" space-y-4">
                {renderPlayerGroup(oddsGroups.favorites, "Favorites")}
                {renderPlayerGroup(oddsGroups.likely, "Likely")}
                {renderPlayerGroup(oddsGroups.possible, "Possible")}
                {renderPlayerGroup(oddsGroups.longshots, "Long Shots")}
              </div>
            ) : (
              /* All players in simple grid for name sorting or search results */
              <div className="">
                {filteredAndSortedPlayers.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
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
                          height="h-11"
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
          </div>
        )}
      </div>
    </div>
  );
};

export default AnytimeGoalscorer;
