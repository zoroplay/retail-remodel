import React from "react";
import { Outcome } from "@/data/types/betting.types";
import OddsButton from "@/components/buttons/OddsButton";
import { PreMatchFixture } from "@/store/features/types/fixtures.types";

interface MatchResultBothTeamsScoreProps {
  fixture_data: PreMatchFixture;
  disabled?: boolean;
  market_id: number;
}

const MatchResultBothTeamsScore: React.FC<MatchResultBothTeamsScoreProps> = ({
  disabled = false,
  fixture_data,
  market_id,
}) => {
  const outcomes =
    fixture_data?.outcomes?.filter(
      (outcome) => (outcome.marketID || outcome.marketId) === market_id
    ) || [];
  // Group outcomes by result type (Home/Draw/Away) and score option (Yes/No)
  const groupedOutcomes = outcomes.reduce((acc, outcome) => {
    const displayName = outcome.displayName.toLowerCase();

    let resultType = "";
    let scoreOption = "";

    // Determine result type
    if (displayName.includes("home")) {
      resultType = "home";
    } else if (displayName.includes("draw")) {
      resultType = "draw";
    } else if (displayName.includes("away")) {
      resultType = "away";
    }

    // Determine score option
    if (displayName.includes("yes")) {
      scoreOption = "yes";
    } else if (displayName.includes("no")) {
      scoreOption = "no";
    }

    if (!acc[resultType]) {
      acc[resultType] = {};
    }

    acc[resultType][scoreOption] = outcome;

    return acc;
  }, {} as Record<string, Record<string, any>>);

  const resultTypes = [
    { key: "home", label: "Home Win", icon: "1" },
    { key: "draw", label: "Draw", icon: "X" },
    { key: "away", label: "Away Win", icon: "2" },
  ];

  if (outcomes.length === 0) return null;

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gray-900 px-4 py-3 border-b border-gray-700">
        <h3 className="text-white font-medium text-sm">
          Match Result & Both Teams to Score
        </h3>
        <p className="text-gray-400 text-xs mt-1">
          Select match result and whether both teams will score
        </p>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Column Headers */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="text-center text-gray-400 text-xs font-medium">
            Match Result
          </div>
          <div className="text-center text-gray-400 text-xs font-medium">
            Both Score: Yes
          </div>
          <div className="text-center text-gray-400 text-xs font-medium">
            Both Score: No
          </div>
        </div>

        {/* Outcome Rows */}
        <div className="space-y-2">
          {resultTypes.map(({ key, label, icon }) => {
            const resultOutcomes = groupedOutcomes[key];

            if (!resultOutcomes) {
              return null;
            }

            return (
              <div key={key} className="grid grid-cols-3 gap-2 items-center">
                {/* Result Label */}
                <div className="flex items-center gap-2 text-white text-sm">
                  <div className="w-6 h-6 bg-gray-700 rounded flex items-center justify-center text-xs font-bold">
                    {icon}
                  </div>
                  <span className="font-medium">{label}</span>
                </div>

                {/* Yes Option */}
                <div className="flex justify-center">
                  {resultOutcomes.yes ? (
                    <OddsButton
                      outcome={resultOutcomes.yes as any}
                      disabled={disabled}
                      fixture_data={fixture_data}
                      game_id={fixture_data?.gameID as unknown as number}
                    />
                  ) : (
                    <div className="bg-gray-700 text-gray-500 px-3 py-2 rounded text-sm text-center w-full">
                      -
                    </div>
                  )}
                </div>

                {/* No Option */}
                <div className="flex justify-center">
                  {resultOutcomes.no ? (
                    <OddsButton
                      outcome={resultOutcomes.no as any}
                      disabled={disabled}
                      fixture_data={fixture_data}
                      game_id={fixture_data?.gameID as unknown as number}
                    />
                  ) : (
                    <div className="bg-gray-700 text-gray-500 px-3 py-2 rounded text-sm text-center w-full">
                      -
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="mt-4 pt-3 border-t border-gray-700">
          <p className="text-gray-400 text-xs">
            <span className="font-medium">Note:</span> "Both Teams to Score"
            means both teams must score at least one goal during the match.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MatchResultBothTeamsScore;
