import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch";
import { useBetting } from "@/hooks/useBetting";
import { useModal } from "@/hooks/useModal";
import { removeCashDeskItem } from "@/store/features/slice/cashdesk.slice";
import { MODAL_COMPONENTS, SelectedBet } from "@/store/features/types";
import { Trash2, X } from "lucide-react";
import React from "react";
import { getClientTheme } from "@/config/theme.config";

type Props = {
  selection: SelectedBet;
  bg_color?: string;

  border_color?: string;
  text_color?: string;
};

const SlipItem = ({ selection, bg_color, border_color, text_color }: Props) => {
  const { classes } = getClientTheme();
  const betslipClasses = classes.betslip;
  const dispatch = useAppDispatch();
  const { openModal } = useModal();
  const bettingState = useAppSelector((state) => state.betting);
  const {
    clearBets,
    toggleActive,
    selected_bets,
    stake,
    total_odds,
    potential_winnings,
    updateStake,
    removeBet,
  } = useBetting();
  return (
    <div
      key={selection.game.event_id}
      className={`flex items-center justify-between gap-3 transition-all duration-300 ${
        bg_color || betslipClasses["header-bg"]
      } border-b p-2 ${border_color || betslipClasses["divider"]}`}
    >
      <div className="flex w-full gap-1">
        <input
          type="checkbox"
          className="w-4 h-4 cursor-pointer"
          checked={selection.is_active}
          onChange={() => {
            toggleActive({
              event_id: Number(selection.game.event_id),
              display_name: selection.game.display_name,
            });
          }}
        />
        <div
          className="flex-1 cursor-pointer"
          onClick={() => {
            if (openModal)
              openModal({
                modal_name: MODAL_COMPONENTS.GAME_OPTIONS,
                ref: selection.game.event_id,
              });
          }}
        >
          <div className="flex flex-col justify-start items-start gap-1">
            <div
              className={`text-xs uppercase tracking-wide ${betslipClasses["outcome-name-text"]}`}
            >
              {selection.game.outcome_name}
            </div>
            <div
              className={`text-[10px] ${betslipClasses["tab-inactive-text"]}`}
            >
              {selection.game.event_name}
            </div>
            <div
              className={`text-[10px] ${betslipClasses["tab-inactive-text"]}`}
            >
              {selection.game.market_name}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-between items-end h-full gap-2">
        <button
          className="px-1 py-1 h-6 w-6 flex justify-center items-center  text-red-300  rounded hover:bg-red-600/70 transition"
          title="Preview"
          onClick={() => {
            // removeBet({
            //   event_id: Number(sel.game.event_id),
            //   display_name: sel.game.display_name,
            // });
            Promise.all([
              removeBet({
                event_id: Number(selection.game.event_id),
                display_name: selection.game.display_name,
              }),
              dispatch(
                removeCashDeskItem({
                  event_id: String(selection.game.event_id),
                })
              ),
            ]);
          }}
        >
          <X size={18} />
        </button>
        <div className="flex justify-between items-center gap-1">
          <div
            className={`text-[10px] ${betslipClasses["tab-inactive-text"]} flex justify-end items-center gap-1`}
          >
            <span
              className={`font-bold text-xs ${
                text_color || betslipClasses["outcome-name-text"]
              }`}
            >
              {selection.game.odds}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlipItem;
