import { getClientTheme } from "@/config/theme.config";
import { SelectedMarket } from "@/data/types/betting.types";
import React from "react";
const { classes } = getClientTheme();
type Props = {};

export const SkeletonCard = ({ title }: { title: string }) => (
  <div className="rounded-2xl shadow-lg p1 animate-pulse">
    <div
      className={`mb-2 border ${classes.game_options_modal["market-card-border"]} rounded-lg ${classes["skeleton-bg"]}`}
    >
      <div className="w-full flex items-center justify-between px-3 py-2 text-left">
        <div className="flex items-center gap-2">
          <div className={`h-5 w-5 ${classes["skeleton-bg"]} rounded-full`} />
          <span className="font-semibold text-gray-400/50 text-sm">
            {title}
          </span>
          <div
            className={`h-4 w-4 ${classes["skeleton-bg"]} rounded-full ml-1`}
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 w-full px-3 pb-3">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className={`min-w-[90px] h-10 ${classes["skeleton-bg"]} rounded-xl`}
          />
        ))}
      </div>
    </div>
  </div>
);

export const SkeletonTitle = () => (
  <div className="flex flex-col gap-2 animate-pulse w-full">
    <div className={`h-6  ${classes["skeleton-bg"]} rounded`} />
    <div className="flex justify-between items-center gap-2">
      <div className={`h-4 w-1/2 ${classes["skeleton-bg"]} rounded`} />
      <div className={`h-4 w-1/2 ${classes["skeleton-bg"]} rounded`} />
    </div>
  </div>
);

export const FixturesSkeletonCard = ({
  selected_markets,
}: {
  selected_markets: SelectedMarket[];
}) => (
  <div
    className={`divide-y ${classes.sports_page["card-border"]} max-h-[84vh] overflow-y-auto `}
  >
    {[...Array(3)].map((_, groupIndex) => (
      <div key={groupIndex}>
        <div
          className={`${classes.sports_page["date-separator-bg"]} px-6 py-1 border-b ${classes.sports_page["date-separator-border"]}`}
        >
          <div
            className={`h-4 $ ${classes["skeleton-bg"]} rounded animate-pulse w-32`}
          ></div>
        </div>
        {[...Array(4)].map((_, gameIndex) => (
          <div
            key={gameIndex}
            className="grid grid-cols-[repeat(17,minmax(0,1fr))] gap-1 px-2 py-4 border-l-4 border-transparent animate-pulse"
          >
            {/* Time Skeleton */}
            <div
              className={`col-span-2 ${classes.sports_page["time-border"]} border-r flex flex-col items-start justify-center`}
            >
              <div
                className={`h-4  ${classes["skeleton-bg"]} rounded w-12 mb-1 animate-pulse`}
              ></div>
            </div>

            {/* Match Info Skeleton */}
            <div className="col-span-6 flex flex-col justify-center">
              <div
                className={`h-3 ${classes["skeleton-bg"]} rounded w-32 mb-2 animate-pulse`}
              ></div>
              <div
                className={`h-4 ${classes["skeleton-bg"]} rounded w-48 animate-pulse`}
              ></div>
            </div>

            {/* Dynamic Market Outcomes Skeleton */}
            {selected_markets.map((market, outcomeIndex) => {
              const isFirst = outcomeIndex === 0;
              const isLast = outcomeIndex === selected_markets.length - 1;
              // let rounded = "";
              // if (isFirst) rounded = "rounded-l-md";
              // else if (isLast) rounded = "rounded-r-md";
              return (
                <div
                  key={market.marketID}
                  className="col-span-4 flex items-center justify-center gap-0.5"
                >
                  {market.outcomes.map((outcome) => (
                    <div
                      key={outcome.outcomeID}
                      className={`h-10  ${classes["skeleton-bg"]} ${classes.game_options_modal["odds-button-border"]} border-2 rounded flex-1 animate-pulse`}
                    ></div>
                  ))}
                </div>
              );
            })}

            {/* More Button Skeleton */}
            <div className="col-span-1 ml-2 px-2 flex items-center justify-center">
              <div
                className={`${classes["skeleton-bg"]} ${classes.game_options_modal["odds-button-border"]} border-2 rounded w-12 h-10 animate-pulse`}
              ></div>
            </div>
          </div>
        ))}
      </div>
    ))}
  </div>
);
