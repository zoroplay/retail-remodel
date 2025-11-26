export default class CalculatedGroup {
  public Grouping: number;
  public Combinations: number = 0;
  public StakeForCombination: number = 0;
  public StakeForCombinationTaxed: number = 0;
  public MaxWinForUnit: number = 0;
  public MaxBonusForUnit: number = 0;
  public MinWinForUnit: number = 0;
  public MinBonusForUnit: number = 0;
  public MinPercentageBonus: number = 0;
  public MaxPercentageBonus: number = 0;

  constructor(grouping: number) {
    this.Grouping = grouping;
  }

  MaxBonus(): number {
    return this.MaxBonusForUnit * this.Combinations * this.StakeForCombination;
  }

  MaxWin(): number {
    return this.MaxWinForUnit * this.Combinations * this.StakeForCombination;
  }

  NetStakeMaxWin(): number {
    return (
      this.MaxWinForUnit * this.Combinations * this.StakeForCombinationTaxed
    );
  }

  MinBonus(): number {
    return this.MinBonusForUnit * this.Combinations * this.StakeForCombination;
  }

  MinWin(): number {
    return this.MinWinForUnit * this.Combinations * this.StakeForCombination;
  }

  NetStakeMinWin(): number {
    return (
      this.MinWinForUnit * this.Combinations * this.StakeForCombinationTaxed
    );
  }
}
