export const calculateBonus = (
  potentialWin: number,
  coupon: any,
  globalVar: any,
  bonusList: any[]
): number => {
  // Basic bonus calculation - you can enhance this based on your business logic
  if (!bonusList || bonusList.length === 0) return 0;

  const selections = coupon.selections || coupon.selected_bets || [];
  const numSelections = selections.length;

  const applicableBonus = bonusList.find(
    (bonus) => bonus.ticket_length === numSelections
  );

  if (applicableBonus) {
    return (potentialWin * applicableBonus.bonus) / 100;
  }

  return 0;
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
};
