import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch";
import { SelectedBet, MODAL_COMPONENTS } from "@/store/features/types";
import { updateStake as updateStakeAction } from "@/store/features/slice/betting.slice";
import React, { useEffect, useState } from "react";
import { formatNumber } from "../../utils/couponHelpers";
import { Ticket, Trash2 } from "lucide-react";
import { useBetting } from "@/hooks/useBetting";
import { useModal } from "@/hooks/useModal";
import Input from "../inputs/Input";
import CurrencyFormatter from "../inputs/CurrencyFormatter";
import { removeCashDeskItem } from "@/store/features/slice/cashdesk.slice";
import SlipItem from "./bet-slip/SlipItem";
import { getClientTheme } from "@/config/theme.config";
import { EmptyBetSlip } from "./Multiple";

interface Combo {
  Grouping: number;
  Combinations: number;
  Stake: number;
  checked: boolean;
  minWin?: number;
  maxWin?: number;
}

interface CombinedProps {
  couponData?: {
    combos?: Combo[];
    stake?: number;
    totalStake?: number;
    minBonus?: number;
    maxBonus?: number;
    minWin?: number;
    maxWin?: number;
    currency?: string;
  };

  globalVar: any;
  bonusList: any;
}

const Combined: React.FC<CombinedProps> = ({
  bonusList,
  globalVar,
  couponData,
}) => {
  const { classes } = getClientTheme();
  const betslipClasses = classes.betslip;
  const dispatch = useAppDispatch();
  const { openModal } = useModal();
  const bettingState = useAppSelector((state) => state.betting);
  const {
    clearBets,
    addBet,
    selected_bets,
    stake,
    total_odds,
    potential_winnings,
    updateStake,
    updateComboStake,
    toggleComboChecked,
    removeBet,
  } = useBetting();

  // Get combos directly from Redux - no local state needed
  const combos = bettingState.coupon_data?.combos || [];

  // Helper function for calculating combinations
  const calculateCombinationCount = (n: number, k: number): number => {
    if (k > n) return 0;
    if (k === 0 || k === n) return 1;

    let result = 1;
    for (let i = 1; i <= k; i++) {
      result = (result * (n - i + 1)) / i;
    }
    return Math.floor(result);
  };

  // Handle stake change for a combo
  const handleStakeChange = (index: number, value: string) => {
    const stakeValue = Number(value ?? 0);
    if (stakeValue < 0) return;

    // Update Redux store directly - no local state manipulation
    updateComboStake({
      combo_index: index,
      stake: stakeValue,
      global_vars: globalVar,
      bonus_list: bonusList,
    });
  };

  const getComboName = (grouping: number): string => {
    switch (grouping) {
      case 1:
        return "Singles";
      case 2:
        return "Doubles";
      case 3:
        return "Trebles";
      default:
        return `${grouping} folds`;
    }
  };

  // Use stake and win values directly from Redux
  const totalStake = stake || 0;

  const totalMinWin = combos.reduce((total: number, combo: any) => {
    return total + (combo.min_win || 0);
  }, 0);

  const totalMaxWin = combos.reduce((total: number, combo: any) => {
    return total + (combo.max_win || 0);
  }, 0);

  return (
    <div className={` ${classes["border"]} rounded-lg mb-4`}>
      {/* Header */}
      <div className={`flex flex-col gap-2 max-h-[24vh] overflow-y-auto`}>
        {selected_bets.length === 0 ? (
          <EmptyBetSlip />
        ) : (
          <div className=" ">
            {selected_bets.map((sel, idx: number) => (
              <SlipItem key={idx} selection={sel} />
            ))}
          </div>
        )}
      </div>
      <div
        className={`grid grid-cols-4 gap-4 p-1 border-b !${betslipClasses["divider"]} ${classes.cashdesk_page["column-header-bg"]} rounded-t-md`}
      >
        <span
          className={`text-[10px] font-semibold ${classes.cashdesk_page["column-header-text"]}`}
        >
          Type
        </span>
        <span
          className={`text-[10px] font-semibold ${classes.cashdesk_page["column-header-text"]}`}
        >
          N. Comb.
        </span>
        <span
          className={`text-[10px] font-semibold ${classes.cashdesk_page["column-header-text"]}`}
        >
          Amount
        </span>
        <span
          className={`text-[10px] font-semibold ${classes.cashdesk_page["column-header-text"]}`}
        >
          Pot. wins
        </span>
      </div>

      {/* Play All Option */}
      <div
        className={`flex items-center justify-between p-2 py-1 pb-0 border-b ${betslipClasses["divider"]} `}
      >
        <div className="flex items-center">
          <button
            className={`${classes.cashdesk_page["summary-label-text"]} text-xs`}
          >
            Play all
          </button>
        </div>
        <div className="flex items-center gap-2 max-w-[140px] ">
          {/* <Input
            label=""
            value={String(stake)}
            onChange={(e) => {
              const v = Number(e.target.value || 0);
              updateStake({ stake: Number.isNaN(v) ? 0 : v });
            }}
            tabIndex={3}
            bg_color="bg-gradient-to-r from-slate-800 to-slate-700"
            border_color="border border-slate-600"
            text_color="text-white"
            className="w-full rounded-lg text-white placeholder-slate-400 transition-all duration-200"
            placeholder="Enter stake amount"
            name={""}
            height={"h-[32px]"}
            type="num_select"
            num_select_placeholder={"NGN"}
          /> */}
          {/* <input
            type="text"
            className="w-16 px-2 py-1 text-xs bg-slate-700 border border-slate-600 rounded text-white"
            maxLength={5}
            placeholder="0"
          />
          <span className="text-xs text-slate-400">
            {globalVar?.Currency || "NGN"}
          </span> */}
        </div>
      </div>

      {/* Combo Rows */}
      {combos.length === 0 ? (
        <div
          className={`p-4 text-center ${betslipClasses["tab-inactive-text"]} text-sm`}
        >
          No combos available.
        </div>
      ) : (
        <div className="max-h-[30vh] overflow-y-auto">
          {combos.map((combo: any, idx: number) => (
            <div
              key={idx}
              className={`${
                classes["text-secondary"]
              } grid grid-cols-[2fr_1fr_1.5fr_1fr_1.5fr] gap-4 p-1 py-1 border-b ${[
                "divider",
              ]} border-l-4 border-l-transparent ${
                classes["item-hover-border-l"]
              }  last:border-b-0 hover:${betslipClasses["tab-bg"]}`}
            >
              {/* Checkbox & Type */}
              <div className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={combo.checked}
                  onChange={() => {
                    // Toggle checked state via Redux
                    toggleComboChecked(idx);
                  }}
                  className="accent-purple-500      w-3.5 h-3.5"
                />
                <span className={`text-[10px] font-semibold`}>
                  {getComboName(combo.grouping)}
                </span>
              </div>

              {/* Combinations */}
              <div className="flex items-center">
                <span className={`text-xs font-semibold `}>
                  {combo.combinations}
                </span>
              </div>

              {/* Amount Input */}
              <div className="flex items-center gap-2 w-full">
                {/* Potential Wins */}
                <div className="flex items-center text-[10px]">
                  <span>
                    {combo.min_win ? formatNumber(combo.min_win) : 0} /{" "}
                    {combo.max_win ? formatNumber(combo.max_win) : 0}
                  </span>
                </div>
                {/* <input
                  type="number"
                  min={0}
                  value={combo.Stake || ""}
                  onChange={(e) => handleStakeChange(idx, e.target.value)}
                  className="w-16 px-2 py-1 text-xs bg-slate-700 border border-slate-600 rounded text-white"
                  maxLength={5}
                  placeholder="0"
                  />
                  <span className="text-xs text-slate-400">
                  {globalVar?.Currency || "NGN"}
                  </span> */}
              </div>
              <div className="flex col-span-2 items-center gap-2 justify-center  w-full">
                <Input
                  label=""
                  value={String(combo.stake_per_combination || "")}
                  onChange={(e) => handleStakeChange(idx, e.target.value)}
                  tabIndex={3}
                  text_color={`${classes["input-text"]} text-[9.5px]`}
                  bg_color={classes["input-bg"]}
                  border_color={classes["input-border"]}
                  className="w-full rounded-lg text-white placeholder-slate-400 transition-all duration-200"
                  placeholder="stake"
                  name={""}
                  height={"h-[28px]"}
                  type="num_select"
                  num_select_placeholder={"NGN"}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary Section */}
      <div className={`rounded-b-lg`}>
        {/* Total Stake */}
        <div
          className={`flex items-center justify-between p-2 py-1 pb-0 border-y ${betslipClasses["divider"]}`}
        >
          <div
            className={`text-xs font-semibold ${betslipClasses["tab-inactive-text"]}`}
          >
            Total Stake
          </div>
          <div className="flex items-center gap-2">
            <Input
              label=""
              value={String(totalStake || "")}
              onChange={(e) => {
                const newTotalStake = Number(e.target.value || 0);
                if (newTotalStake < 0) return;

                // Simple unified stake update - Redux handles distribution automatically
                updateStake({
                  stake: newTotalStake,
                  global_vars: globalVar,
                  bonus_list: bonusList,
                });
              }}
              tabIndex={3}
              text_color={`${classes["input-text"]} text-xs`}
              bg_color={classes["input-bg"]}
              border_color={classes["input-border"]}
              className="w-full rounded-lg text-white placeholder-slate-400 transition-all duration-200"
              placeholder="Enter total stake"
              name={""}
              height={"h-[32px]"}
              type="num_select"
              num_select_placeholder={"NGN"}
            />
          </div>
        </div>

        {/* Quick Stake Buttons */}
        <div className="grid grid-cols-4 gap-1 p-1">
          {[100, 500, 1000, 5000].map((amount) => (
            <button
              key={amount}
              onClick={() => {
                // Simple unified stake update - Redux handles distribution automatically
                updateStake({
                  stake: amount,
                  global_vars: globalVar,
                  bonus_list: bonusList,
                });
              }}
              className={`${classes.deposit_page["quick-button-bg"]} ${classes.deposit_page["quick-button-hover"]} border ${classes.deposit_page["quick-button-border"]} ${classes.deposit_page["quick-button-text"]} text-[11px] h-6 flex justify-center items-center py-1 rounded-lg transition-all duration-200 hover:scale-105`}
            >
              {" "}
              <CurrencyFormatter
                amount={amount}
                className="pointer-events-none"
                spanClassName="pointer-events-none"
              />
            </button>
          ))}
        </div>
        {/* Bonus */}
        {/* <div className="flex items-center justify-between p-2 py-1 border-b border-slate-700">
          <div className="text-xs font-semibold text-slate-300">Bonus</div>
          <div className="text-right text-[11px]">
            <div className="text-slate-300 flex gap-1">
              Min:{" "}
              <CurrencyFormatter
                amount={couponData?.minBonus || 0}
                className="!text-green-400"
                spanClassName=""
              />
            </div>
            <div className="text-slate-300 flex gap-1">
              Max:{" "}
              <CurrencyFormatter
                amount={couponData?.maxBonus || 0}
                className="!text-green-400"
                spanClassName=""
              />
            </div>
          </div>
        </div> */}

        {/* Potential Winnings */}
        {/* <div className="flex items-center justify-between p-2 py-1">
          <div className="text-xs font-semibold text-slate-300">
            Pot. Winnings
          </div>
          <div className="text-right text-xs">
            <div className="text-slate-300">
              Min{" "}
              <span className="text-green-400 font-bold">
                {formatNumber(totalMinWin)}
              </span>{" "}
              {globalVar?.Currency || "NGN"}
            </div>
            <div className="text-slate-300">
              Max{" "}
              <span className="text-green-400 font-bold">
                {formatNumber(totalMaxWin)}
              </span>{" "}
              {globalVar?.Currency || "NGN"}
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Combined;
