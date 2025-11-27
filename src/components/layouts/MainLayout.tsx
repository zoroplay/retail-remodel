/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ReactNode, useState, useEffect } from "react";

// import { FaTicketAlt, FaTrashAlt } from "react-icons/fa";
import { MdLock } from "react-icons/md";

import Input from "../inputs/Input";
import AppHeader from "./AppHeader";
import { useBetting } from "../../hooks/useBetting";
import { usePlaceBet } from "../../hooks/usePlaceBet";
import { SHORTCUT_SEQUENCES } from "../../lib/shortcuts";
import { AppHelper } from "../../lib/helper";
import { Trash } from "lucide-react";

interface MainLayoutProps {
  children: ReactNode;
  title?: string;
  showNavigation?: boolean;
  onMenuPress?: () => void;
  onSearchPress?: () => void;
  showBalance?: boolean;
  navigationBar: ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  title,
  showNavigation = true,
  onMenuPress,
  onSearchPress,
  showBalance = true,
  navigationBar,
}) => {
  // const { user } = useAppSelector((state) => state.user);
  const {
    selected_bets,
    total_odds,
    potential_winnings,
    stake,
    updateStake,
    clearBets,
    removeBet,
    updateBetOdds,
  } = useBetting();

  // MQTT for tracking odds changes on selected bets
  // const { subscribe } = useMqtt();
  const [oddsChangeNotifications, setOddsChangeNotifications] = useState<any[]>(
    []
  );

  // // Subscribe to odds changes for selected bets
  // useEffect(() => {
  //   if (selected_bets.length === 0) return;

  //   // Get unique match IDs from selected bets
  //   const matchIds = selected_bets
  //     .map((bet) => bet.game?.matchID || bet.game?.match_id)
  //     .filter(Boolean)
  //     .filter((id, index, arr) => arr.indexOf(id) === index);

  //   const unsubscribers: (() => void)[] = [];

  //   // Subscribe to odds changes for each match with selected bets
  //   // matchIds.forEach((matchId) => {
  //   //   if (matchId) {
  //   //     // Subscribe to both live and prematch odds changes for this match
  //   //     unsubscribers.push(
  //   //       subscribe(`feeds/live/odds_change/${matchId}`, (data) => {
  //   //         handleOddsChangeForSelectedBets(data, String(matchId));
  //   //       })
  //   //     );

  //   //     unsubscribers.push(
  //   //       subscribe(`feeds/prematch/odds_change/${matchId}`, (data) => {
  //   //         handleOddsChangeForSelectedBets(data, String(matchId));
  //   //       })
  //   //     );
  //   //   }
  //   // });

  //   return () => {
  //     unsubscribers.forEach((unsub) => unsub());
  //   };
  // }, [selected_bets, subscribe]);

  // Handle odds changes for selected bets
  const handleOddsChangeForSelectedBets = (data: any, matchId: string) => {
    const markets = data.markets || data.odds?.markets || [];

    markets.forEach((market: any) => {
      const outcomes = market.outcomes || market.outcome || [];

      outcomes.forEach((outcome: any) => {
        // Find if this outcome is in our selected bets
        const selectedBet = selected_bets.find(
          (bet) =>
            String(bet.game?.matchID || bet.game?.match_id) === matchId &&
            bet.game?.outcome_id === outcome.id
        );

        if (selectedBet) {
          // Update the odds for this selected bet
          updateBetOdds({
            event_id: Number(
              selectedBet.game?.event_id ||
                selectedBet.game?.matchID ||
                selectedBet.game?.match_id
            ),
            outcome_id: outcome.id,
            new_odds: outcome.odds,
            status: market.status || 0,
            active: outcome.active ? 1 : 0,
          });

          // Show notification for odds change
          setOddsChangeNotifications((prev) => [
            ...prev.slice(-2),
            {
              id: Date.now(),
              matchId,
              outcomeName: outcome.name || selectedBet.game?.outcome_name,
              oldOdds: selectedBet.game?.odds,
              newOdds: outcome.odds,
              timestamp: new Date().toLocaleTimeString(),
            },
          ]);

          // Auto-remove notification after 5 seconds
          setTimeout(() => {
            setOddsChangeNotifications((prev) =>
              prev.filter((notif) => notif.id !== Date.now())
            );
          }, 5000);
        }
      });
    });
  };

  const {
    isConfirming,
    isPlacingBet,
    placeBet,
    confirmBet,
    cancelBet,
    canPlaceBet,

    // InsufficientBalanceModalComponent,
    // SuccessModalComponent,
  } = usePlaceBet();

  return (
    <div className="flex-1 bg-primary relative min-h-screen">
      {/* Header Section */}

      {/* Mobile Betting Slip Button - Only visible on small screens */}
      <div
        className="lg:hidden absolute bottom-12 left-4 right-4"
        style={{ zIndex: 9999 }}
      >
        {/* <BettingSlipButton /> */}
      </div>

      {/* Odds Change Notifications */}
      {/* {oddsChangeNotifications.length > 0 && (
        <div
          className="absolute top-20 left-4 right-4 z-50"
          style={{ zIndex: 10000 }}
        >
          {oddsChangeNotifications.map((notification) => (
            <div
              key={notification.id}
              className="bg-yellow-500 border border-yellow-400 rounded-lg p-3 mb-2 shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-white font-bold text-sm">Odds Changed!</p>
                  <p className="text-white text-xs">
                    {notification.outcomeName} - Match {notification.matchId}
                  </p>
                  <p className="text-white text-xs">
                    {notification.oldOdds} → {notification.newOdds}
                  </p>
                </div>
                <p className="text-white text-xs">{notification.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      )} */}

      <div className="lg:flex-row flex w-full bg-secondary h-full">
        <div className="lg:w-3/5 w-full h-full">
          {/* Navigation Bar */}
          {showNavigation && navigationBar}

          {/* Main Content Area */}
          <div className="lg:h-[75vh] h-[80vh]">{children}</div>
        </div>

        {/* Desktop Betting Slip - Only visible on large screens */}
        <div
          className="hidden lg:flex bg-secondary w-2/5 rounded-lg h-[84vh] overflow-y-auto"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            paddingLeft: 8,
            padding: 8,
          }}
        >
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between p-4 py-1 bg-btn-primary">
              <p className="text-lg text-white font-semibold tracking-wider">
                Selection ({selected_bets.length})
              </p>
              <button
                className="p-1 flex justify-center items-center gap-1 cursor-pointer"
                onClick={clearBets}
              >
                <p className="text-white font-semibold">Reset</p>
                {/* <ShortcutButton
                  shortcut={{
                    sequence: SHORTCUT_SEQUENCES.RESET_BETS,
                    description: "Reset All Bets",
                    action: clearBets,
                    category: "betting",
                    icon: "refresh",
                  }}
                  variant="outline"
                  size="sm"
                  className="bg-[#0D0D0D80] p-2 py-1 rounded-md"
                /> */}
              </button>
              <button className="p-1 cursor-pointer">
                <p className="text-white font-semibold tracking-widest">
                  Clear Game
                </p>
              </button>
              <button className="bg-[#0D0D0D80] px-2 p-1 rounded-lg cursor-pointer">
                <p className="text-white font-semibold tracking-widest">
                  *9code*
                </p>
              </button>
            </div>

            {/* Betting slip table header */}
            <div className="flex gap-2 rounded">
              <p className="flex w-14 p-2 h-9 text-center justify-center items-center text-white bg-primary text-sm font-semibold">
                #
              </p>
              <p className="flex w-28 p-2 h-9 text-center justify-center items-center text-white bg-primary text-sm font-semibold">
                Game
              </p>
              <p className="flex w-20 p-2 h-9 text-center justify-center items-center text-white bg-primary text-sm font-semibold">
                Time
              </p>
              <p className="flex w-24 p-2 h-9 text-center justify-center items-center text-white bg-primary text-sm font-semibold">
                Bet
              </p>
              <p className="flex w-24 p-2 h-9 text-center justify-center items-center text-white bg-primary text-sm font-semibold">
                Odds
              </p>
              <p className="flex w-20 p-2 h-9 text-center justify-center items-center text-white bg-primary text-sm font-semibold"></p>
            </div>
          </div>

          {/* Selected Bets */}
          <div className="flex-1 rounded gap-1">
            {selected_bets.length === 0 ? (
              <div className="py-8 items-center flex flex-col">
                {/* <FaTicketAlt size={48} color="#9CA3AF" /> */}
                <p className="text-gray-500 mt-2">No selections yet</p>
                <p className="text-gray-400 text-sm">
                  Select games to add to your betting slip
                </p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto">
                {selected_bets.map((bet, index) => {
                  // Check if this bet is suspended
                  // Based on Unified Feed: 0=Active, 1=Suspended, 2=Deactivated, 3=Settled, 4=Cancelled
                  const isBetSuspended = AppHelper.isMarketSuspended(
                    bet.game?.market_status || 0
                  );

                  return (
                    <div
                      key={`${bet.game_id}-${index}-game-${bet.game.gameID}`}
                      className={`flex gap-2 p-1 rounded ${
                        isBetSuspended
                          ? "bg-red-900/30 border border-red-500/50"
                          : "bg-gray-800/50"
                      }`}
                    >
                      <div className="flex w-14 p-2 h-14 text-center justify-center items-center">
                        <p className="text-white text-sm font-semibold">
                          {bet.game_id}
                        </p>
                      </div>
                      <div className="flex w-28 p-2 h-14 text-center justify-center items-center gap-1">
                        <p className="text-white text-xs font-semibold leading-3">
                          {bet.game.event_name?.split("\n")[0]}
                        </p>
                        {isBetSuspended && (
                          <div className="flex items-center mt-1">
                            {/* <MdLock size={12} color="#EF4444" /> */}
                            <p className="text-red-400 text-xs font-bold ml-1">
                              {AppHelper.getMarketStatusName(
                                bet.game?.market_status || 0
                              ).toUpperCase()}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="flex w-20 p-2 h-14 text-center justify-center items-center">
                        <p className="text-white text-sm font-semibold">
                          {AppHelper.convertToTimeString(
                            new Date(bet.game.event_date)
                          )}
                        </p>
                      </div>
                      <div className="flex w-24 p-2 h-14 justify-center items-center gap-1">
                        <p className="text-white text-xs font-semibold leading-3">
                          {bet.game.market_name}
                        </p>
                        <p className="text-white text-xs font-semibold leading-3">
                          {bet.game.outcome_name}
                        </p>
                      </div>
                      <div className="flex w-24 p-2 h-14 justify-center items-center">
                        {isBetSuspended ? (
                          <div className="flex items-center">
                            {/* <MdLock size={16} color="#9CA3AF" /> */}
                            <p className="text-gray-400 text-sm font-semibold ml-1">
                              --
                            </p>
                          </div>
                        ) : (
                          <p className="text-yellow-500 text-sm font-semibold">
                            {bet.game.odds}
                          </p>
                        )}
                      </div>
                      <div className="flex w-20 h-14 justify-center items-center">
                        <button
                          className="w-12 h-12 p-2 justify-center items-center bg-btn-primary rounded-lg cursor-pointer"
                          onClick={() => {
                            // console.log("bet.game_id", bet.game_id);
                            // console.log("bet.event_id", bet.game.event_id);
                            // console.log("bet.game", bet.game);
                            removeBet({
                              event_id: Number(bet.game.event_id),
                              display_name: bet.game.display_name,
                            });
                          }}
                        >
                          <Trash size={24} color="white" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Betting Summary */}
          {selected_bets.length > 0 && (
            <div className="p-4 rounded-lg">
              <div className="gap-2 flex p-1">
                <div className="flex flex-col justify-between w-1/3 items-center gap-1">
                  <div className="bg-btn-primary flex justify-center items-center px-3 py-1 w-full rounded">
                    <p className="text-white font-semibold"># Stake</p>
                  </div>
                  <Input
                    name="stake"
                    placeholder="Stake"
                    value={String(stake)}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      updateStake({ stake: Number(e.target.value) });
                    }}
                    type="number"
                    height="h-[32px]"
                    className="h-[32px] bg-gray-800 text-black"
                  />
                </div>
                <div className="flex flex-col justify-between w-1/3 items-center gap-1">
                  <div className="bg-btn-primary flex justify-center items-center px-3 py-1 w-full rounded">
                    <p className="text-white font-semibold">Odds</p>
                  </div>
                  <div className="bg-gray-800 w-full flex justify-center items-center h-[36px] px-3 py-1 rounded">
                    <p className="text-yellow-400 font-semibold">
                      {total_odds.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col justify-between w-1/3 items-center gap-1">
                  <div className="bg-btn-primary flex justify-center items-center px-3 py-1 w-full rounded">
                    <p className="text-white font-semibold">Payout</p>
                  </div>
                  <div className="bg-gray-800 w-full flex justify-center items-center h-[36px] px-3 py-1 rounded">
                    <p className="text-yellow-400 font-semibold">
                      {potential_winnings.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
              {/* Place Bet Button Section */}
              {isConfirming ? (
                <div className="flex gap-2">
                  <button
                    className="flex-1 bg-rose-500 py-3 rounded-lg cursor-pointer disabled:opacity-50"
                    onClick={cancelBet}
                    disabled={isPlacingBet}
                  >
                    <p className="text-white text-center font-bold text-lg">
                      CANCEL
                    </p>
                  </button>
                  <button
                    className="flex-1 bg-[#01C400] py-3 rounded-lg cursor-pointer disabled:opacity-50"
                    onClick={placeBet}
                    disabled={isPlacingBet}
                  >
                    <div className="flex justify-center items-center gap-2">
                      {isPlacingBet && (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      )}
                      <p className="text-white text-center font-bold text-lg">
                        {isPlacingBet ? "PLACING BET..." : "CONFIRM BET"}
                      </p>
                    </div>
                  </button>
                </div>
              ) : (
                <button
                  className={`py-3 rounded-lg w-full px-4 cursor-pointer disabled:opacity-50 ${
                    canPlaceBet ? "bg-[#01C400]" : "bg-gray-500"
                  }`}
                  onClick={confirmBet}
                  disabled={!canPlaceBet}
                >
                  <p className="text-white text-center font-bold text-lg">
                    PLACE BET
                  </p>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
