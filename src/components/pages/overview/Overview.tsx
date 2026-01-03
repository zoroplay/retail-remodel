"use client";
import React, { useCallback, useState, useEffect, useMemo } from "react";

import OddsButton from "@/components/buttons/OddsButton";
import { ChevronRight } from "lucide-react";
import { useSearchParams, useLocation, useParams } from "react-router-dom";
import { getClientTheme } from "@/config/theme.config";
import { MARKET_SECTION, DISPLAY_NAME_ENUM } from "@/data/enums/enum";
import { Outcome, Fixture, SelectedMarket } from "@/data/types/betting.types";
import { useAppSelector, useAppDispatch } from "@/hooks/useAppDispatch";
import { useBetting } from "@/hooks/useBetting";
import { useModal } from "@/hooks/useModal";
import { usePrematchMqtt } from "@/hooks/useMqtt";
import {
  setSelectedGame,
  updateFixtureOutcome,
} from "@/store/features/slice/fixtures.slice";
import { MODAL_COMPONENTS } from "@/store/features/types";
import { PreMatchFixture } from "@/store/features/types/fixtures.types";
import {
  useTopBetsQuery,
  useFixturesQuery,
} from "@/store/services/bets.service";
import { FixturesSkeletonCard } from "@/components/skeletons/OutComesSkeleton";
import FixtureItem from "@/components/bets/FixtureItem";
import FixtureCard from "@/components/bets/FixtureCard";

interface OverviewScreenProps {
  sportId?: string;
}

export default function OverviewScreen({
  sportId: propSportId,
}: OverviewScreenProps = {}) {
  const { tournament_details } = useAppSelector((state) => state.app);
  const { app_refresh } = useAppSelector((state) => state.app);
  const { fixtures = [] } = useAppSelector((state) => state.fixtures);
  const dispatch = useAppDispatch();
  const { openModal } = useModal();
  const params = useParams();
  const sport_id = params.sport_id?.replace("sport_", "");

  const { classes } = getClientTheme();
  const sportsPageClasses = classes.sports_page;

  const { subscribeToPrematchOdds, subscribeToPrematchBetStop } =
    usePrematchMqtt();
  const { selected_bets } = useBetting();

  const { data: data_to_bets, isLoading: is_top_bets_loading } =
    useTopBetsQuery();
  const top_bets = Array.isArray(data_to_bets?.data) ? data_to_bets.data : [];
  const top_bet = top_bets.find(
    (bet) => bet?.sportName.toLowerCase() === "soccer"
  );
  const tournamentId = useMemo(
    () =>
      String(
        !sport_id
          ? top_bet?.tournamentID
          : tournament_details?.tournament_id || top_bet?.tournamentID || ""
      ),
    [tournament_details?.tournament_id, top_bet?.tournamentID]
  );

  const sportId = useMemo(
    () =>
      String(
        !sport_id
          ? top_bet?.sportID
          : tournament_details?.sport_id ?? top_bet?.sportID ?? ""
      ),
    [tournament_details?.sport_id, top_bet?.sportID]
  );

  const {
    data: fixturesData,
    isFetching: fixturesLoading,
    refetch,
    status: fixturesStatus,
  } = useFixturesQuery(
    {
      tournament_id: tournamentId,
      sport_id: sportId,
      period: "all",
      markets: [
        String(MARKET_SECTION.ONE_X_TWO),
        String(MARKET_SECTION.DOUBLE_CHANCE),
        String(MARKET_SECTION.OVER_UNDER),
        String(MARKET_SECTION.TENNIS_WINNER),
        String(MARKET_SECTION.NFL_ONE_X_TWO),
        String(MARKET_SECTION.NFL_HSH),
      ],
      specifier: "",
    },
    {
      skip: !!tournament_details.query,
    }
  );
  let selectedMarkets: SelectedMarket[] = Array.isArray(
    fixturesData?.selectedMarket
  )
    ? fixturesData.selectedMarket
    : [];

  // For soccer (sportID 1), only show 1X2 and Double Chance markets
  if ((sport_id || 1) == "1") {
    selectedMarkets = selectedMarkets.filter(
      (market) =>
        market.marketID === String(MARKET_SECTION.ONE_X_TWO) || // 1X2
        market.marketID === String(MARKET_SECTION.DOUBLE_CHANCE) // Double Chance
    );
  }
  if (selectedMarkets.length > 2) {
    selectedMarkets = selectedMarkets.slice(0, 2);
  }

  // Safe refetch helpers
  const safeRefetchFixtures = useCallback(() => {
    if (
      !tournament_details.query &&
      fixturesStatus !== "uninitialized" &&
      refetch
    ) {
      try {
        return refetch();
      } catch (error) {
        console.warn("Failed to refetch fixtures:", error);
      }
    }
  }, [tournament_details.query, fixturesStatus, refetch]);

  useEffect(() => {
    if (tournament_details.tournament_id) {
      safeRefetchFixtures();
    }
  }, [tournament_details.tournament_id]);

  useEffect(() => {
    if (!tournament_details.query && refetch) {
      refetch();
    }
  }, [app_refresh, tournament_details.query, refetch]);

  useEffect(() => {
    const unsubscribePrematchOdds = subscribeToPrematchOdds(
      handlePrematchOddsChange
    );
    const unsubscribePrematchBetStop = subscribeToPrematchBetStop(
      handlePrematchBetStop
    );
    return () => {
      unsubscribePrematchOdds();
      unsubscribePrematchBetStop();
    };
  }, [subscribeToPrematchOdds, subscribeToPrematchBetStop]);

  const displayFixtures = fixtures;
  const isLoading = fixturesLoading;

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

  const handlePrematchOddsChange = (data: any) => {
    const matchId = data.event_id || data.match_id;
    if (!matchId) return;

    const markets = data.markets || data.odds?.markets || [];
    markets.forEach((market: any) => {
      const outcomes = market.outcomes || market.outcome || [];
      outcomes.forEach((outcome: any) => {
        dispatch(
          updateFixtureOutcome({
            matchID: matchId.toString(),
            outcomeID: outcome.id,
            updates: {
              odds: outcome.odds,
              active:
                typeof outcome.active === "boolean"
                  ? outcome.active
                    ? 1
                    : 0
                  : outcome.active || 0,
              status: market.status || 0,
            },
          })
        );
      });
    });
  };

  const handlePrematchBetStop = (data: any) => {
    const matchId = data.event_id || data.match_id;
    if (!matchId) return;
  };

  return (
    <div
      className={`h-[calc(100vh-100px)] overflow-y-auto flex justify-center items-start text-white relative w-full ${sportsPageClasses["container-bg"]}`}
    >
      <div className="h-full p-1 w-full">
        {/* Unified Table Structure */}
        <div
          className={`${sportsPageClasses["card-bg"]} border ${sportsPageClasses["card-border"]} shadow-2xl overflow-hidden rounded-lg`}
        >
          <div
            className={`${sportsPageClasses["header-bg"]} border-b ${sportsPageClasses["header-border"]}`}
          >
            <div
              className={`grid grid-cols-[repeat(17,minmax(0,1fr))] gap-1 px-6 py-1 text-xs font-semibold ${sportsPageClasses["header-text"]}`}
            >
              <div className="col-span-2">Time</div>
              <div className="col-span-6">Match</div>
              {selectedMarkets.map((market, index) => (
                <div
                  key={market.marketID}
                  className="col-span-4 flex items-center justify-between"
                >
                  {market.outcomes.map((outcome, outcomeIndex) => (
                    <span
                      key={outcome.outcomeID}
                      className="w-1/3 flex justify-center items-center"
                    >
                      {outcome.outcomeName}
                    </span>
                  ))}
                </div>
              ))}
              <div className="col-span-1 text-center">+</div>
            </div>
          </div>

          {(isLoading || is_top_bets_loading) && (
            <FixturesSkeletonCard selected_markets={selectedMarkets} />
          )}

          {!isLoading &&
            !is_top_bets_loading &&
            displayFixtures.length === 0 && (
              <div className={`flex-1 justify-center items-center p-4`}>
                <p className={`${sportsPageClasses["empty-text"]}`}>
                  No Prematch games available
                </p>
              </div>
            )}

          {/* Games grouped by date */}
          {!isLoading && !is_top_bets_loading && displayFixtures.length > 0 && (
            <FixtureCard
              fixtures={displayFixtures as PreMatchFixture[]}
              selectedMarkets={selectedMarkets}
            />
          )}
        </div>
      </div>
    </div>
  );
}
