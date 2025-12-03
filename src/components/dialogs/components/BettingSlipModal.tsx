"use client";
import React from "react";

import { IoTicketOutline } from "react-icons/io5";
import { FaTrashAlt } from "react-icons/fa";
import SideOverlay from "../SideOverlay";
import { useBetting } from "../../../hooks/useBetting";
import { usePlaceBet } from "../../../hooks/usePlaceBet";
import { AppHelper } from "../../../lib/helper";
import Input from "../../inputs/Input";

type Props = {
  onClose: () => void;
};

const BettingSlipModal: React.FC<Props> = ({ onClose }) => {
  const {
    selected_bets,
    total_odds,
    potential_winnings,
    stake,
    clearBets,
    updateStake,
    removeBet,
  } = useBetting();

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
    <SideOverlay open={true} onOpenChange={() => onClose()} width="1800px">
      <div className="flex-1 p-4">
        {selected_bets.length === 0 ? (
          <div className="py-8 flex flex-col items-center">
            {/* <IoTicketOutline size={48} color="#9CA3AF" /> */}
            <span className="text-gray-500 mt-2">No selections yet</span>
            <span className="text-gray-400 text-sm">
              Select games to add to your betting slip
            </span>
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            {/* Betting slip table header */}
            <div className="flex flex-row gap-2 rounded">
              <span className="flex w-28 p-2 h-9 text-center justify-center items-center text-white bg-primary text-sm font-semibold">
                #
              </span>
              <span className="flex w-44 p-2 h-9 text-center justify-center items-center text-white bg-primary text-sm font-semibold">
                Game
              </span>
              <span className="flex w-32 p-2 h-9 text-center justify-center items-center text-white bg-primary text-sm font-semibold">
                Time
              </span>
              <span className="flex w-48 p-2 h-9 text-center justify-center items-center text-white bg-primary text-sm font-semibold">
                Bet
              </span>
              <span className="flex w-24 p-2 h-9 text-center justify-center items-center text-white bg-primary text-sm font-semibold">
                Odds
              </span>
              <span className="flex w-28 p-2 h-9 text-center justify-center items-center text-white bg-primary text-sm font-semibold"></span>
            </div>

            {/* Selected Bets */}
            <div
              className="flex-1 overflow-y-auto"
              style={{ paddingBottom: 20 }}
            >
              {selected_bets.map((bet, index) => (
                <div
                  key={`${bet.game_id}-${index}-game-${bet.game.gameID}`}
                  className="flex flex-row gap-2 p-1 bg-gray-800/50 rounded"
                >
                  <div className="flex w-28 p-2 h-14 text-center justify-center items-center">
                    <span className="text-white text-sm font-semibold">
                      {bet.game_id}
                    </span>
                  </div>
                  <div className="flex w-44 p-2 h-14 text-center justify-center items-center gap-1">
                    <span className="text-white text-xs font-semibold leading-3">
                      {bet.game.event_name?.split("\n")[0]}
                    </span>
                  </div>
                  <div className="flex w-32 p-2 h-14 text-center justify-center items-center">
                    <span className="text-white text-sm font-semibold">
                      {AppHelper.convertToTimeString(
                        new Date(bet.game.event_date)
                      )}
                    </span>
                  </div>
                  <div className="flex w-48 p-2 h-14 justify-center items-center gap-1">
                    <span className="text-white text-xs font-semibold leading-3">
                      {bet.game.market_name}
                    </span>
                    <span className="text-white text-xs font-semibold leading-3">
                      {bet.game.outcome_name}
                    </span>
                  </div>
                  <div className="flex w-24 p-2 h-14 justify-center items-center">
                    <span className="text-yellow-500 text-sm font-semibold">
                      {bet.game.odds}
                    </span>
                  </div>
                  <div className="flex w-28 h-14 justify-center items-center">
                    <button
                      className="w-12 h-12 p-2 flex justify-center items-center bg-btn-primary rounded-lg"
                      onClick={() => {
                        removeBet({
                          event_id: Number(bet.game.event_id),
                          display_name: bet.game.display_name,
                        });
                      }}
                    >
                      FGH
                      {/* <FaTrashAlt size={24} color="white" /> */}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Betting Summary */}
            <div className="p-4 rounded-lg bg-gray-800/30">
              <div className="gap-2 flex flex-row p-1">
                <div className="flex flex-col justify-between w-1/3 items-center gap-1">
                  <div className="bg-btn-primary flex justify-center items-center px-3 py-1 w-full rounded">
                    <span className="text-white font-semibold"># Stake</span>
                  </div>
                  <Input
                    placeholder="Stake"
                    value={String(stake)}
                    onChange={(e) => {
                      updateStake({ stake: Number(e.target.value) });
                    }}
                    // keyboardType="numeric"
                    height="h-[32px]"
                    bg_color="bg-gray-800"
                    text_color="text-white"
                    name={""}
                  />
                </div>
                <div className="flex flex-col justify-between w-1/3 items-center gap-1">
                  <div className="bg-btn-primary flex justify-center items-center px-3 py-1 w-full rounded">
                    <span className="text-white font-semibold">Odds</span>
                  </div>
                  <div className="bg-gray-800 w-full flex justify-center items-center h-[36px] px-3 py-1 rounded">
                    <span className="text-yellow-400 font-semibold">
                      {total_odds.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col justify-between w-1/3 items-center gap-1">
                  <div className="bg-btn-primary flex justify-center items-center px-3 py-1 w-full rounded">
                    <span className="text-white font-semibold">Payout</span>
                  </div>
                  <div className="bg-gray-800 w-full flex justify-center items-center h-[36px] px-3 py-1 rounded">
                    <span className="text-yellow-400 font-semibold">
                      {potential_winnings.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-row gap-2 mt-3">
                <button
                  className="flex-1 bg-gray-600 py-2 rounded-lg"
                  onClick={clearBets}
                  type="button"
                >
                  <span className="text-white text-center font-bold text-sm">
                    CLEAR ALL
                  </span>
                </button>

                {isConfirming ? (
                  <>
                    <button
                      className="flex-1 bg-rose-500 py-2 rounded-lg"
                      onClick={cancelBet}
                      disabled={isPlacingBet}
                      type="button"
                    >
                      <span className="text-white text-center font-bold text-sm">
                        CANCEL
                      </span>
                    </button>
                    <button
                      className="flex-1 bg-[#01C400] py-2 rounded-lg"
                      onClick={placeBet}
                      disabled={isPlacingBet}
                      type="button"
                    >
                      <span className="flex flex-row justify-center items-center gap-2">
                        {isPlacingBet && (
                          <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        )}
                        <span className="text-white text-center font-bold text-sm">
                          {isPlacingBet ? "PLACING..." : "CONFIRM BET"}
                        </span>
                      </span>
                    </button>
                  </>
                ) : (
                  <button
                    className={`flex-1 py-2 rounded-lg ${
                      canPlaceBet ? "bg-[#01C400]" : "bg-gray-500"
                    }`}
                    onClick={confirmBet}
                    disabled={!canPlaceBet}
                    type="button"
                  >
                    <span className="text-white text-center font-bold text-sm">
                      PLACE BET
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modals */}
        {/* <InsufficientBalanceModalComponent
          visible={showInsufficientBalanceModal}
          title={modalData.title}
          message={modalData.message}
          currentBalance={modalData.currentBalance}
          requiredAmount={modalData.requiredAmount}
          currency={modalData.currency}
          onClose={closeInsufficientBalanceModal}
          onDeposit={handleDeposit}
        />
        <SuccessModalComponent
          visible={showSuccessModal}
          title={modalData.title}
          message={modalData.message}
          onClose={closeSuccessModal}
        /> */}
      </div>
    </SideOverlay>
  );
};

export default BettingSlipModal;
