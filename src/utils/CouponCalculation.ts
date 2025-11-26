/* eslint-disable no-extend-native */
import SlotKey from "./SlotKey";
import CalculatedGroup from "./CalculatedGroup";
import CalculatedCoupon from "./CalculatedCoupon";
import { Combination, FastCombination } from "./Combination";
import { arrayExtensions } from "./arrayExtensions";
import { calculateBonus } from "./couponHelpers";

interface BetSelection {
  matchId: number;
  odds: number;
  fixed?: boolean;
  Fixed?: boolean;
  OddValue?: number;
}

interface BetCouponGroup {
  Grouping: number;
  Combinations: number;
  Stake: number;
  checked?: boolean;
  minWin?: number;
  maxWin?: number;
  MaxBonus?: number;
  MaxWinNet?: number;
  NetStakeMaxWin?: number;
  MinBonus?: number;
  MinWinNet?: number;
  NetStakeMinWin?: number;
  MinPercentageBonus?: number;
  MaxPercentageBonus?: number;
  NetStake?: number;
}

interface CouponData {
  selections: BetSelection[];
  Groupings: BetCouponGroup[];
  combos?: BetCouponGroup[];
  stake: number;
  totalStake?: number;
  exciseDuty?: number;
  TotalCombinations?: number;
  minWin?: number;
  NetStakeMinWin?: number;
  maxWin?: number;
  NetStakeMaxWin?: number;
  minBonus?: number;
  maxBonus?: number;
  MinPercentageBonus?: number;
  MaxPercentageBonus?: number;
  minOdds?: number;
  maxOdds?: number;
  PossibleMissingGroupings?: BetCouponGroup[];
}

export default class CouponCalculation {
  // Environment variables - these should be configured in your app
  private readonly MAX_COMBINATIONS_BY_GROUPING = 10000;
  private readonly MAX_COUPON_COMBINATIONS = 50000;
  private readonly MIN_BONUS_ODD = 1.5;
  private readonly MIN_GROUPINGS_BET_STAKE = 1;
  private readonly MIN_BET_STAKE = 1;
  private readonly STAKE_INNER_MOD0_COMBINATION = 1;

  getSlotKeyFromString = (key: string): SlotKey => {
    const splitKey = key.split("_");
    const matchId = parseInt(splitKey[0]);
    const index = parseInt(splitKey[1]);
    return new SlotKey(matchId, index);
  };

  getOddsForSlotKeyMap = (
    coupon: CouponData
  ): { [key: string]: BetSelection[] } => {
    const oddsForSlotKeyMap: { [key: string]: BetSelection[] } = {};

    for (let i = 0; i < coupon.selections.length; i++) {
      const odd = coupon.selections[i];
      const keys: SlotKey[] = [];

      for (const key in oddsForSlotKeyMap) {
        const slotKey = this.getSlotKeyFromString(key);
        if (slotKey.MatchId === odd.matchId && slotKey.Index === 0) {
          keys.push(slotKey);
        } else if (slotKey.MatchId === odd.matchId && slotKey.Index > 0) {
          throw new Error("Mixed CompatibilityLevel on odds");
        }
      }

      if (keys.length > 1) {
        throw new Error("Wrong oddsForSlotKeyMap construction");
      }

      if (keys.length === 0) {
        const sk = new SlotKey(odd.matchId, 0);
        const x: BetSelection[] = [];
        x.push(odd);
        oddsForSlotKeyMap[sk.getKey()] = x;
      } else {
        const sk = keys[0];
        const currentSK = oddsForSlotKeyMap[sk.getKey()];
        currentSK.push(odd);
      }
    }

    return oddsForSlotKeyMap;
  };

  calcCombinations = (coupon: CouponData): CalculatedCoupon => {
    const maxCombinationForCoupon = Math.min(
      this.MAX_COMBINATIONS_BY_GROUPING,
      this.MAX_COUPON_COMBINATIONS
    );

    if (
      coupon.selections.length > 0 &&
      coupon.selections.filter((o) => o.fixed || o.Fixed).length ===
        coupon.selections.length
    ) {
      coupon.selections[0].fixed = false;
      coupon.selections[0].Fixed = false;
    }

    const calculatedCouponGroups: (CalculatedGroup | null)[] = [];
    const oddsForSlotKeyMap = this.getOddsForSlotKeyMap(coupon);
    const bankers: BetSelection[] = [];
    const nonBankers: BetSelection[][] = [];
    let slotKeyCount = 0;
    let integrale = false;
    const numSelectionsPerEvent: number[] = [];

    for (const key in oddsForSlotKeyMap) {
      const currentSK = oddsForSlotKeyMap[key];
      if (currentSK[0].Fixed || currentSK[0].fixed) {
        bankers.push(currentSK[0]);
      } else {
        nonBankers.push(currentSK);
        numSelectionsPerEvent.push(currentSK.length);
      }
      slotKeyCount += 1;
      if (currentSK.length > 1) integrale = true;
    }

    const firstGroup = bankers.length > 0 ? bankers.length : 1;

    for (let groupIndex = 0; groupIndex <= slotKeyCount; groupIndex++) {
      let group: CalculatedGroup | null = null;
      if (groupIndex > 0) {
        group = new CalculatedGroup(groupIndex);
        if (groupIndex < firstGroup) group.Combinations = 0;
      }
      calculatedCouponGroups.push(group);
    }

    if (bankers.length > 0) {
      const bankersGroup = calculatedCouponGroups[
        bankers.length
      ] as CalculatedGroup;
      if (bankersGroup) {
        bankersGroup.Combinations = 0;
      }
    }

    if (!integrale) {
      for (let k = nonBankers.length; k > 0; k--) {
        const n = nonBankers.length;
        const nc = new Combination().choose(n, k);
        const targetGroup = calculatedCouponGroups[
          k + bankers.length
        ] as CalculatedGroup;
        if (targetGroup) {
          if (maxCombinationForCoupon > nc) {
            targetGroup.Combinations = nc;
          } else {
            targetGroup.Combinations = -1;
          }
        }
      }
    } else {
      for (let k = nonBankers.length; k > 0; k--) {
        const combinationsCount =
          this.calcCombinationsForCrossCombinationsBetGroup(
            k,
            numSelectionsPerEvent,
            maxCombinationForCoupon
          );
        const targetGroup = calculatedCouponGroups[
          k + bankers.length
        ] as CalculatedGroup;
        if (targetGroup) {
          targetGroup.Combinations = combinationsCount;
        }
      }
    }

    const maxPossibleGroupings = this.MaxGrouping(coupon.selections);
    for (let index = 0; index < calculatedCouponGroups.length; index++) {
      if (
        calculatedCouponGroups[index] == null ||
        (calculatedCouponGroups[index] as CalculatedGroup).Grouping >
          maxPossibleGroupings
      ) {
        calculatedCouponGroups.splice(index, 1);
        index--;
      }
    }

    const calculatedCoupon = new CalculatedCoupon();
    calculatedCouponGroups.forEach((g) => {
      if (g) {
        calculatedCoupon.Groups.push(g);
      }
    });

    return calculatedCoupon;
  };

  calcCombinationsForCrossCombinationsBetGroup = (
    k: number,
    numSelectionsPerEvent: number[],
    maxCombinationForCoupon: number
  ): number => {
    const chosen = FastCombination.chooseFromSets(numSelectionsPerEvent, k);
    if (chosen > maxCombinationForCoupon) return -1;
    return chosen;
  };

  calcPotentialWins = (
    coupon: CouponData,
    bonusList: any[]
  ): CalculatedCoupon => {
    const maxCombinationForCoupon = Math.min(
      this.MAX_COMBINATIONS_BY_GROUPING,
      this.MAX_COUPON_COMBINATIONS
    );

    const oddsForSlotKeyMap = this.getOddsForSlotKeyMap(coupon);
    const bankers: BetSelection[] = [];
    const nonBankers: BetSelection[][] = [];

    for (const key in oddsForSlotKeyMap) {
      const currentSK = oddsForSlotKeyMap[key];
      if (currentSK[0].Fixed || currentSK[0].fixed) {
        bankers.push(currentSK[0]);
      } else {
        nonBankers.push(currentSK);
      }
    }

    const maxCombination: BetSelection[] = [];
    const minCombination: BetSelection[] = [];

    for (
      let nonBankerIndex = 0;
      nonBankerIndex < nonBankers.length;
      nonBankerIndex++
    ) {
      maxCombination[nonBankerIndex] = arrayExtensions.sortDesc(
        nonBankers[nonBankerIndex],
        "odds"
      )[0];
      minCombination[nonBankerIndex] = arrayExtensions.sortAsc(
        nonBankers[nonBankerIndex],
        "odds"
      )[0];
    }

    const calculatedCouponGroups: CalculatedGroup[] = [];

    for (let i = 0; i < coupon.Groupings.length; i++) {
      const betCouponGroup = coupon.Groupings[i];
      if (betCouponGroup.Combinations > 0) {
        const calculatedGroup = new CalculatedGroup(betCouponGroup.Grouping);
        calculatedGroup.Combinations = betCouponGroup.Combinations;
        calculatedGroup.StakeForCombination = betCouponGroup.Stake;
        calculatedCouponGroups.push(calculatedGroup);
      }
    }

    if (
      coupon.Groupings.length === 0 &&
      bankers.length + nonBankers.length === 1
    ) {
      let combinations = 1;
      if (nonBankers.length > 0) {
        combinations = nonBankers[0].length;
      }
      const calculatedGroup = new CalculatedGroup(1);
      calculatedGroup.Combinations = combinations;
      calculatedGroup.StakeForCombination = coupon.stake / combinations;
      calculatedCouponGroups.push(calculatedGroup);
    }

    let bankersValidEventForBonus = 0;
    let bankersTotalOdds = 1.0;

    for (let i = 0; i < bankers.length; i++) {
      const b = bankers[i];
      bankersTotalOdds *= b.odds;
      bankersTotalOdds = Number(bankersTotalOdds.toFixed(10));
      if ((b.OddValue || b.odds) >= this.MIN_BONUS_ODD) {
        bankersValidEventForBonus++;
      }
    }

    for (let i = 0; i < calculatedCouponGroups.length; i++) {
      const calculatedGroup = calculatedCouponGroups[i];
      const n = nonBankers.length;
      const k = calculatedGroup.Grouping - bankers.length;
      const nc = new Combination().choose(n, k);
      let maxWinForUnit = 0.0;
      let maxBonusForUnit = 0.0;

      if (maxCombinationForCoupon > nc) {
        const combination = new Combination(n, k);
        for (let j = 0; j < nc; j++) {
          let validEventsForBonus = bankersValidEventForBonus;
          let winForUnit = bankersTotalOdds;
          const combOdds = combination.applyTo(maxCombination);

          for (let l = 0; l < combOdds.length; l++) {
            const odd = combOdds[l];
            winForUnit *= odd.odds;
            winForUnit = Number(winForUnit.toFixed(10));
            if (odd.odds >= this.MIN_BONUS_ODD) {
              validEventsForBonus++;
            }
          }

          const percBonus = this.bonusPercentageFromNumberOfEvents(
            bonusList,
            validEventsForBonus
          );
          maxWinForUnit += winForUnit;
          maxBonusForUnit += winForUnit * percBonus;
          const successor = combination.successor();
          if (!successor) break;
          calculatedGroup.MaxPercentageBonus = percBonus;
        }
      }

      calculatedGroup.MaxWinForUnit = maxWinForUnit;
      calculatedGroup.MaxBonusForUnit = maxBonusForUnit;

      let minWinForUnit = bankersTotalOdds;
      let minEventForBonus = bankersValidEventForBonus;
      const sortedMinComb = arrayExtensions.sortAsc(minCombination, "odds");
      const subSortedMinComb = arrayExtensions.take(sortedMinComb, k);

      for (let j = 0; j < subSortedMinComb.length; j++) {
        const odd = subSortedMinComb[j];
        minWinForUnit *= odd.odds;
        minWinForUnit = Number(minWinForUnit.toFixed(10));
        if (odd.odds >= this.MIN_BONUS_ODD) {
          minEventForBonus++;
        }
      }

      const minPercBonus = this.bonusPercentageFromNumberOfEvents(
        bonusList,
        minEventForBonus
      );
      calculatedGroup.MinWinForUnit = minWinForUnit;
      calculatedGroup.MinBonusForUnit = minWinForUnit * minPercBonus;
      calculatedGroup.MinPercentageBonus = minPercBonus;
    }

    const calculatedCoupon = new CalculatedCoupon();
    calculatedCouponGroups.forEach((g) => calculatedCoupon.Groups.push(g));

    return calculatedCoupon;
  };

  bonusPercentageFromNumberOfEvents = (
    bonusList: any[],
    numberOfEvents: number
  ): number => {
    if (bonusList.length === 0) return 0.0;
    if (numberOfEvents < arrayExtensions.min(bonusList, "ticket_length"))
      return 0.0;
    if (numberOfEvents > arrayExtensions.max(bonusList, "ticket_length")) {
      return 0.0;
    }

    const filteredBonusList = bonusList.filter(
      (b) => b.ticket_length === numberOfEvents
    );
    if (filteredBonusList.length > 0) {
      const item = filteredBonusList[0];
      return item.bonus / 100.0;
    }

    return 0.0;
  };

  updateFromCalculatedCoupon = (
    betCoupon: CouponData,
    calculatedCoupon: CalculatedCoupon,
    globalVar: any,
    bonusList: any[]
  ): CouponData => {
    if (betCoupon.Groupings.length > 0) {
      for (let i = 0; i < calculatedCoupon.Groups.length; i++) {
        const calculatedGroup = calculatedCoupon.Groups[i];
        const betCouponGroups = betCoupon.Groupings.filter(
          (g) => g.Grouping === calculatedGroup.Grouping
        );

        if (betCouponGroups.length > 0) {
          const betCouponGroup = betCouponGroups[0];
          betCouponGroup.Combinations = calculatedGroup.Combinations;
          betCouponGroup.MaxBonus = calculatedGroup.MaxBonus();
          betCouponGroup.maxWin = calculatedGroup.MaxWin();
          betCouponGroup.MaxWinNet = calculatedGroup.NetStakeMaxWin();
          betCouponGroup.NetStakeMaxWin = calculatedGroup.NetStakeMaxWin();
          betCouponGroup.MinBonus = calculatedGroup.MinBonus();
          betCouponGroup.minWin = calculatedGroup.MinWin();
          betCouponGroup.MinWinNet = calculatedGroup.NetStakeMinWin();
          betCouponGroup.NetStakeMinWin = calculatedGroup.NetStakeMinWin();
          betCouponGroup.MinPercentageBonus =
            calculatedGroup.MinPercentageBonus;
          betCouponGroup.MaxPercentageBonus =
            calculatedGroup.MaxPercentageBonus;
          betCouponGroup.NetStake = calculatedGroup.StakeForCombinationTaxed;

          if (
            !betCouponGroup.Combinations ||
            betCouponGroup.Combinations <= 0
          ) {
            this.removeGroup(betCoupon, betCouponGroup);
          }
        }
      }
    }

    betCoupon.TotalCombinations = this.getTotalCombinations(betCoupon);
    betCoupon.minWin = this.getMinWin(betCoupon);
    betCoupon.NetStakeMinWin = this.getNetStakeMinWin(betCoupon);
    betCoupon.maxWin = this.getMaxWin(betCoupon);
    betCoupon.NetStakeMaxWin = this.getNetStakeMaxWin(betCoupon);
    betCoupon.minBonus = calculateBonus(
      betCoupon.minWin || 0,
      betCoupon,
      globalVar,
      bonusList
    );
    betCoupon.maxBonus = calculateBonus(
      betCoupon.maxWin || 0,
      betCoupon,
      globalVar,
      bonusList
    );
    betCoupon.maxWin = (betCoupon.maxBonus || 0) + (betCoupon.maxWin || 0);
    betCoupon.minWin =
      this.getMinBonus(betCoupon, bonusList) + (betCoupon.minWin || 0);

    betCoupon.MinPercentageBonus = this.getMinPercentageBonus(betCoupon);
    betCoupon.MaxPercentageBonus = this.getMaxPercentageBonus(betCoupon);
    betCoupon.minOdds = this.getMinOdd(betCoupon);
    betCoupon.maxOdds = this.getMaxOdd(betCoupon);

    return betCoupon;
  };

  MaxGrouping = (selections: BetSelection[]): number => {
    const ret = Number.MAX_VALUE;
    const compatibleMarketsCount = 0;
    const incompatibleMarketsEventCount = arrayExtensions.unique(
      selections,
      "matchId"
    ).length;
    const temp_ret = compatibleMarketsCount + incompatibleMarketsEventCount;

    if (temp_ret > ret) return ret;
    else return temp_ret;
  };

  getTotalCombinations = (betCoupon: CouponData): number => {
    if (betCoupon.Groupings.length > 0) {
      return arrayExtensions.sum(betCoupon.Groupings, "Combinations");
    } else {
      return 0;
    }
  };

  getMinWin = (betCoupon: CouponData): number => {
    if (betCoupon.Groupings.length > 0) {
      return arrayExtensions.min(betCoupon.Groupings, "minWin");
    } else {
      return 0;
    }
  };

  getNetStakeMinWin = (betCoupon: CouponData): number => {
    if (betCoupon.Groupings.length > 0) {
      return arrayExtensions.min(betCoupon.Groupings, "MinWinNet");
    } else {
      return 0;
    }
  };

  getMinOdd = (betCoupon: CouponData): number => {
    if (betCoupon.Groupings && betCoupon.Groupings.length > 0) {
      const minWinGroup = betCoupon.Groupings.filter(
        (g) => (g.Stake || 0) > 0
      ).sort((a, b) => (a.minWin || 0) - (b.minWin || 0))[0];

      if (minWinGroup) {
        return parseFloat(
          ((minWinGroup.minWin || 0) / (minWinGroup.Stake || 1)).toFixed(2)
        );
      }
    }
    return 0;
  };

  getMaxOdd = (betCoupon: CouponData): number => {
    if (betCoupon.Groupings && betCoupon.Groupings.length > 0) {
      const maxOddSum = betCoupon.Groupings.filter(
        (g) => (g.Stake || 0) > 0
      ).reduce((acc, g) => acc + (g.maxWin || 0) / (g.Stake || 1), 0);

      return parseFloat(maxOddSum.toFixed(2));
    }
    return 0;
  };

  getMaxWin = (betCoupon: CouponData): number => {
    if (betCoupon.Groupings.length > 0) {
      return arrayExtensions.sum(betCoupon.Groupings, "maxWin");
    } else {
      return 0;
    }
  };

  getNetStakeMaxWin = (betCoupon: CouponData): number => {
    if (betCoupon.Groupings.length > 0) {
      return arrayExtensions.sum(betCoupon.Groupings, "MaxWinNet");
    } else {
      return 0;
    }
  };

  getMinBonus = (betCoupon: CouponData, bonusList: any[]): number => {
    const minGroup = this.getMinGroup(betCoupon);
    const minBonus = this.getMinBonusLength(bonusList);

    if (minGroup >= minBonus) {
      return betCoupon.minBonus || 0;
    } else {
      return 0;
    }
  };

  getMaxBonus = (betCoupon: CouponData): number => {
    if (betCoupon.Groupings.length > 0) {
      return arrayExtensions.sum(betCoupon.Groupings, "MaxBonus");
    } else {
      return 0;
    }
  };

  getMinGroup = (betCoupon: CouponData): number => {
    if (betCoupon.Groupings.length > 0) {
      return arrayExtensions.min(betCoupon.Groupings, "Grouping");
    } else {
      return 0;
    }
  };

  getMinBonusLength = (bonusList: any[]): number => {
    if (bonusList.length > 0) {
      return arrayExtensions.min(bonusList, "ticket_length");
    } else {
      return 0;
    }
  };

  getMinPercentageBonus = (betCoupon: CouponData): number => {
    if (betCoupon.Groupings.length > 0) {
      return arrayExtensions.min(betCoupon.Groupings, "MinPercentageBonus");
    } else {
      return 0;
    }
  };

  getMaxPercentageBonus = (betCoupon: CouponData): number => {
    if (betCoupon.Groupings.length > 0) {
      return arrayExtensions.max(betCoupon.Groupings, "MaxPercentageBonus");
    } else {
      return 0;
    }
  };

  truncateLastRoundedDecimalValue = (num: number): number => {
    const pointerIdx = num.toString().indexOf(".");
    const precisionLength = num.toString().substring(pointerIdx + 1).length;
    const re = new RegExp("^-?\\d+(?:.\\d{0," + (precisionLength - 1) + "})?");
    const match = num.toString().match(re);
    return parseFloat(match ? match[0] : "0");
  };

  setPossibleCouponStake = (betCoupon: CouponData): CouponData => {
    for (let i = 0; i < betCoupon.Groupings.length; i++) {
      const grpItem = betCoupon.Groupings[i];
      if (!grpItem.Stake) grpItem.Stake = 0;

      let minInnerStakeAllowed = this.MIN_GROUPINGS_BET_STAKE;
      if (betCoupon.stake !== 0) {
        let grpStakeRatio = grpItem.Stake / betCoupon.stake;
        grpStakeRatio = this.truncateLastRoundedDecimalValue(grpStakeRatio);
        minInnerStakeAllowed = Math.max(
          this.MIN_GROUPINGS_BET_STAKE,
          this.MIN_BET_STAKE * grpStakeRatio
        );
      }

      if (this.STAKE_INNER_MOD0_COMBINATION > 0) {
        const modValueItem = grpItem.Stake % this.STAKE_INNER_MOD0_COMBINATION;
        if (modValueItem !== 0) {
          const divValueItem =
            grpItem.Stake / this.STAKE_INNER_MOD0_COMBINATION;
          let rounded = Math.round(divValueItem);
          if (rounded === 0) rounded = 1;
          grpItem.Stake = rounded * this.STAKE_INNER_MOD0_COMBINATION;
        }

        if (grpItem.Stake < minInnerStakeAllowed) {
          const divValueItemMin =
            minInnerStakeAllowed / this.STAKE_INNER_MOD0_COMBINATION;
          let roundedMin = Math.ceil(divValueItemMin);
          if (roundedMin === 0) roundedMin = 1;
          grpItem.Stake = roundedMin * this.STAKE_INNER_MOD0_COMBINATION;
        }
      }

      betCoupon.Groupings[i] = grpItem;
    }

    return betCoupon;
  };

  removeGroup = (
    betCoupon: CouponData,
    betCouponGroup: BetCouponGroup
  ): boolean => {
    return arrayExtensions.remove(
      betCoupon.Groupings,
      "Grouping",
      betCouponGroup.Grouping
    );
  };
}
