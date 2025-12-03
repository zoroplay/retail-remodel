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
      className={`flex items-stretch border justify-between gap-2 transition-all duration-300 mb-2 p-2 shadow-md ${
        betslipClasses["slip-item-bg"]
      } rounded-md shadow-md ${
        selection.is_active ? betslipClasses["slip-item-selected-bg"] : ""
      }`}
      style={{ minHeight: 64 }}
    >
      <div
        className="flex flex-col flex-1 gap-1 cursor-pointer"
        onClick={() => {
          if (openModal)
            openModal({
              modal_name: MODAL_COMPONENTS.GAME_OPTIONS,
              ref: selection.game.event_id,
            });
        }}
      >
        <div className={`flex items-center gap-2 mb-1`}>
          {/* <input
            type="checkbox"
            className="w-4 h-4 cursor-pointer accent-yellow-500"
            checked={selection.is_active}
            onChange={(e) => {
              e.stopPropagation();
              toggleActive({
                event_id: Number(selection.game.event_id),
                display_name: selection.game.display_name,
              });
            }}
          /> */}
          <span
            className={`${betslipClasses["slip-item-header"]} font-semibold text-xs`}
          >
            {selection.game.event_name}
          </span>
        </div>
        <div
          className={`${betslipClasses["slip-item-main"]} font-bold text-xs leading-tight`}
        >
          {selection.game.outcome_name}
        </div>
        <div className={`${betslipClasses["slip-item-market"]} text-[10px]`}>
          {selection.game.market_name}
        </div>
        <div className={`${betslipClasses["slip-item-footer"]} text-[10px]`}>
          {selection.game.display_name}
        </div>
      </div>
      <div className="flex flex-col items-end justify-between gap-2 min-w-[60px]">
        <button
          className={`h-7 w-7 flex justify-center items-center rounded-full ${betslipClasses["slip-item-remove"]} bg-transparent hover:bg-red-900/30 transition`}
          title="Remove"
          onClick={(e) => {
            e.stopPropagation();
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
        <span className={`${betslipClasses["slip-item-odds"]} text-xs`}>
          {selection.game.odds}
        </span>
      </div>
    </div>
  );
};

export default SlipItem;
