export class Combination {
  private n: number;
  private k: number;
  private data: number[];

  constructor(n?: number, k?: number) {
    this.n = n || 0;
    this.k = k || 0;
    this.data = [];
    if (n && k) {
      for (let i = 0; i < k; i++) {
        this.data[i] = i;
      }
    }
  }

  choose(n: number, k: number): number {
    if (k === 0) return 1;
    if (k > n) return 0;

    let result = 1;
    for (let i = 1; i <= k; i++) {
      result = (result * (n - i + 1)) / i;
    }
    return Math.floor(result);
  }

  applyTo<T>(items: T[]): T[] {
    const result: T[] = [];
    for (let i = 0; i < this.k; i++) {
      if (this.data[i] < items.length) {
        result.push(items[this.data[i]]);
      }
    }
    return result;
  }

  successor(): Combination | null {
    if (!this.hasNext()) {
      return null;
    }

    let i = this.k - 1;
    while (i >= 0 && this.data[i] === this.n - this.k + i) {
      i--;
    }

    if (i >= 0) {
      this.data[i]++;
      for (let j = i + 1; j < this.k; j++) {
        this.data[j] = this.data[i] + j - i;
      }
    }

    return this;
  }

  private hasNext(): boolean {
    return this.data[0] < this.n - this.k;
  }
}

export class FastCombination {
  static chooseFromSets(numSelectionsPerEvent: number[], k: number): number {
    if (k === 0) return 1;
    if (k > numSelectionsPerEvent.length) return 0;

    // Calculate combinations for cross-combinations
    let result = 1;
    const sortedSets = [...numSelectionsPerEvent].sort((a, b) => b - a);

    for (let i = 0; i < Math.min(k, sortedSets.length); i++) {
      result *= sortedSets[i];
    }

    return result;
  }
}
