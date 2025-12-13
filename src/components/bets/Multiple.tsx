import React from "react";
import Input from "../inputs/Input";
import { useModal } from "@/hooks/useModal";
import { MODAL_COMPONENTS } from "@/store/features/types";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useBetting } from "@/hooks/useBetting";
import { Ticket, Trash, Trash2 } from "lucide-react";
import { removeCashDeskItem } from "@/store/features/slice/cashdesk.slice";
import SlipItem from "./bet-slip/SlipItem";
import { getClientTheme } from "@/config/theme.config";
import CurrencyFormatter from "../inputs/CurrencyFormatter";

interface MultipleProps {
  globalVar: any;
}
const { classes } = getClientTheme();
const betslipClasses = classes.betslip;
export const EmptyBetSlip = () => (
  <div className="py-10 flex flex-col items-center justify-center text-center">
    <div
      className={`w-14 h-14 ${classes["bg-secondary"]} rounded-full flex items-center justify-center mb-4`}
    >
      <Ticket
        size={24}
        className={classes.transactions_page["column-header-text"]}
      />
    </div>
    <h3
      className={`${classes.transactions_page["row-text"]} text-base font-semibold mb-2`}
    >
      Empty Betting Slip
    </h3>
    <p className={`${betslipClasses["tab-inactive-text"]} text-xs mb-1`}>
      No selections yet
    </p>
    <p
      className={`${betslipClasses["tab-inactive-text"]} text-[11px] max-w-sm`}
    >
      Select games to see them here and place your bet.
    </p>
  </div>
);

const Multiple: React.FC<MultipleProps> = ({ globalVar }) => {
  const { openModal } = useModal();
  const dispatch = useAppDispatch();
  const {
    clearBets,
    addBet,
    selected_bets,
    stake,
    total_odds,
    potential_winnings,
    updateStake,
    removeBet,
  } = useBetting();
  //  MODAL_COMPONENTS.GAME_OPTIONS

  // const potentialWin = (stake * totalOdds).toFixed(2);

  return (
    <div className="flex flex-col gap-2">
      <div
        className={`  ${betslipClasses["slip-item-divider"]} rounded-lg  flex flex-col gap-2 max-h-[48vh] overflow-y-auto`}
      >
        {selected_bets.length === 0 ? (
          <EmptyBetSlip />
        ) : (
          <div className="">
            {selected_bets.map((sel, idx: number) => (
              <SlipItem key={idx} selection={sel} />
            ))}
          </div>
        )}
      </div>
      <div className="space-y-1">
        {/* <label className="text-slate-300 text-sm font-medium">
                  Stake Amount
                </label> */}
        <div className="relative text-gray-400">
          {/* <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 text-sm">
                    ₦
                  </span> */}
          <Input
            label="Stake amount"
            value={String(stake)}
            onChange={(e) => {
              const v = Number(e.target.value || 0);
              updateStake({ stake: Number.isNaN(v) ? 0 : v });
            }}
            tabIndex={3}
            text_color={`${classes["input-text"]} text-xs`}
            bg_color={classes["input-bg"]}
            border_color={classes["input-border"]}
            className="w-full rounded-lg placeholder-slate-400 transition-all duration-200"
            placeholder="Enter stake amount"
            name={""}
            height={"h-[32px]"}
            type="num_select"
            num_select_placeholder={"NGN"}
          />
        </div>

        {/* Quick Stake Buttons */}
        <div className="grid grid-cols-4 gap-1">
          {[100, 500, 1000, 5000].map((amount) => (
            <button
              key={amount}
              onClick={() => {
                console.log("TYUTUsW", amount);
                updateStake({ stake: amount });
              }}
              className={`${betslipClasses["tab-bg"]} hover:bg-black/20 border ${betslipClasses["tab-border"]} ${betslipClasses["tab-inactive-text"]} hover:${betslipClasses["tab-active-text"]} text-xs py-1 pb-0.5 rounded-lg transition-all duration-200 hover:scale-105`}
            >
              <CurrencyFormatter
                amount={amount}
                className="pointer-events-none"
                spanClassName="pointer-events-none"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Multiple;
