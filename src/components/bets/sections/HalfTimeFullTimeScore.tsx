import React, { useState, useMemo } from "react";
import { PreMatchFixture } from "@/store/features/types/fixtures.types";
import { SkeletonCard } from "@/components/skeletons/OutComesSkeleton";
import {
  IoChevronForward,
  IoChevronDown,
  IoInformationCircleOutline,
  IoTime,
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

const HalfTimeFullTimeScore = ({
  fixture_data,
  disabled,
  is_loading,
  market_id,
}: Props) => {
  const [is_collapsed, setIsCollapsed] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<"odds" | "halftime">("halftime");
  const theme = getClientTheme();
  const marketClasses = theme.classes.game_options_modal;

  const outcomes =
    fixture_data?.outcomes?.filter(
      (outcome) => (outcome.marketID || outcome.marketId) === market_id
    ) || [];

  const title = outcomes?.[0]?.marketName || "HT/FT Correct Score";

  if (is_loading) return <SkeletonCard title={title} />;
  if (outcomes.length === 0) return null;

  // Parse and group outcomes by halftime score
  const parseScore = (outcomeScore: string) => {
    const parts = outcomeScore.split(" ");
    if (parts.length === 2) {
      return {
        halftime: parts[0],
        fulltime: parts[1],
        original: outcomeScore,
      };
    }
    return {
      halftime: outcomeScore,
      fulltime: outcomeScore,
      original: outcomeScore,
    };
  };

  // Filter and sort outcomes
  const filteredAndSortedOutcomes = useMemo(() => {
    let filtered = outcomes;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (outcome) =>
          outcome.outcomeName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          outcome.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      if (sortBy === "odds") {
        return (a.odds || 0) - (b.odds || 0);
      } else {
        // Sort by halftime score then fulltime score
        const scoreA = parseScore(a.outcomeName || a.displayName || "");
        const scoreB = parseScore(b.outcomeName || b.displayName || "");

        if (scoreA.halftime !== scoreB.halftime) {
          return scoreA.halftime.localeCompare(scoreB.halftime);
        }
        return scoreA.fulltime.localeCompare(scoreB.fulltime);
      }
    });
  }, [outcomes, searchTerm, sortBy]);

  // Group outcomes by halftime score
  const scoreGroups = useMemo(() => {
    const groups: { [key: string]: any[] } = {};

    filteredAndSortedOutcomes.forEach((outcome) => {
      const score = parseScore(
        outcome.outcomeName || outcome.displayName || ""
      );
      const htScore = score.halftime;

      if (!groups[htScore]) {
        groups[htScore] = [];
      }
      groups[htScore].push(outcome);
    });

    return groups;
  }, [filteredAndSortedOutcomes]);

  const renderScoreGroup = (htScore: string, outcomes: any[]) => {
    if (outcomes.length === 0) return null;

    // Categorize halftime scores
    const getScoreCategory = (score: string) => {
      if (score === "0:0") return { color: "", label: "Goalless HT" };
      if (score.includes("0:") || score.includes(":0"))
        return { color: "", label: "Low Scoring HT" };
      if (score === "1:1") return { color: "", label: "Balanced HT" };
      if (score.includes("4+")) return { color: "", label: "High Scoring" };
      return { color: "", label: "Active HT" };
    };

    const category = getScoreCategory(htScore);

    return (
      <div key={htScore} className="mb-4">
        <div
          className={`text-xs font-medium mb-2 ${category.color} flex items-center gap-2`}
        >
          <span className={marketClasses["axis-label-text"]}>
            {category.label} ({htScore})
          </span>
          <span
            className={`${marketClasses["axis-label-bg"]} ${marketClasses["axis-label-text"]} px-2 py-0.5 rounded-full text-xs`}
          >
            {outcomes.length}
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {outcomes.map((outcome, index) => {
            const displayScore =
              outcome.outcomeName || outcome.displayName || "Unknown";

            return (
              <OddsButton
                key={outcome.outcomeID}
                outcome={{
                  ...outcome,
                  outcomeName: displayScore,
                  displayName: displayScore,
                }}
                game_id={fixture_data?.gameID as unknown as number}
                fixture_data={fixture_data}
                show_display_name={true}
                // bg_color={"bg-white text-black"}
                height="h-12"
                disabled={disabled}
                rounded={`${
                  outcomes?.length < 5 && index === 0
                    ? "rounded-tl-md rounded-bl-md"
                    : index === 3
                    ? "rounded-tr-md"
                    : (outcomes?.length % 2 == 0 && outcomes?.length - 2) ===
                      index
                    ? "rounded-bl-md"
                    : (outcomes?.length % 2 !== 0 && outcomes?.length - 3) ===
                      index
                    ? "rounded-bl-md"
                    : outcomes?.length - 1 === index && index === 1
                    ? "rounded-tr-md rounded-br-md"
                    : index === 0
                    ? "rounded-tl-md "
                    : outcomes?.length - 1 === index
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
          <div className="p-2 space-y-3">
            {/* Score combinations organized by halftime groups */}
            {sortBy === "halftime" && !searchTerm ? (
              <div className="space-y-4">
                {Object.keys(scoreGroups)
                  .sort((a, b) => {
                    // Sort halftime scores logically
                    if (a === "0:0") return -1;
                    if (b === "0:0") return 1;
                    if (a.includes("4+")) return 1;
                    if (b.includes("4+")) return -1;
                    return a.localeCompare(b);
                  })
                  .map((htScore) =>
                    renderScoreGroup(htScore, scoreGroups[htScore])
                  )}
              </div>
            ) : (
              /* All scores in simple grid for odds sorting or search results */
              <div className="max-h-96 overflow-y-auto">
                {filteredAndSortedOutcomes.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                    {filteredAndSortedOutcomes.map((outcome) => {
                      const displayScore =
                        outcome.outcomeName || outcome.displayName || "Unknown";

                      return (
                        <OddsButton
                          key={outcome.outcomeID}
                          outcome={{
                            ...outcome,
                            outcomeName: displayScore,
                            displayName: displayScore,
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
                    No score combinations found matching "{searchTerm}"
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

export default HalfTimeFullTimeScore;
