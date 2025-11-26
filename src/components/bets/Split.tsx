import React from "react";
import Input from "../inputs/Input";

interface SplitProps {
  couponData: any;
  dispatch: any;
  globalVar: any;
  bonusList: any;
}

const Split: React.FC<SplitProps> = ({
  couponData,
  dispatch,
  globalVar,
  bonusList,
}) => {
  const selections = couponData.selected_bets || [];
  const [stakes, setStakes] = React.useState<number[]>(
    selections.map(() => couponData.stake || 0)
  );

  const handleStakeChange = (idx: number, value: string) => {
    const newStakes = [...stakes];
    newStakes[idx] = Number(value);
    setStakes(newStakes);
    dispatch({
      type: "UPDATE_SPLIT_STAKE",
      payload: { idx, stake: Number(value) },
    });
  };

  return (
    <div className="p-2 bg-green-900/10 border border-green-700/50 rounded mb-2">
      {selections.length === 0 ? (
        <div className="text-slate-400">No selections added.</div>
      ) : (
        <div className="space-y-2 mb-2">
          {selections.map((sel: any, idx: number) => {
            const odds = Number(sel.game.odds) || 1;
            const stake = stakes[idx] || 0;
            const potentialWin = (stake * odds).toFixed(2);
            return (
              <div
                key={idx}
                className="flex items-center gap-2 bg-green-800/10 rounded p-2 border border-green-700/30"
              >
                <div className="flex-1">
                  <div className="font-semibold text-xs text-green-300">
                    {sel.game.event_name}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Market: {sel.game.market_name}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Odds:{" "}
                    <span className="font-bold text-yellow-300">{odds}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="w-20">
                    <Input
                      type="number"
                      //   min={0}
                      value={String(stake)}
                      onChange={(e) => handleStakeChange(idx, e.target.value)}
                      className="w-20 px-2 py-1 rounded border text-white"
                      placeholder="Stake"
                      bg_color="bg-green-900"
                      height="h-[30px]"
                      border_color="border-green-500"
                      name={""}
                    />
                  </div>
                  <div className="text-xs text-slate-300">
                    Pot. win:{" "}
                    <span className="font-bold text-green-400">
                      {potentialWin}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Split;
