// Array prototype extensions - converted to utility functions for TypeScript compatibility
export const arrayExtensions = {
  unique: <T>(array: T[], key: keyof T): T[] => {
    const unique: { [key: string]: boolean } = {};
    const distinct: T[] = [];
    for (let i = 0; i < array.length; i++) {
      const current = array[i];
      const keyValue = String(current[key]);
      if (typeof unique[keyValue] === "undefined") {
        distinct.push(current);
      }
      unique[keyValue] = true;
    }
    return distinct;
  },

  sum: <T>(array: T[], key: keyof T): number => {
    let sum = 0;
    for (let i = 0; i < array.length; i++) {
      const current = array[i];
      sum += Number(current[key]);
    }
    return sum;
  },

  min: <T>(array: T[], key: keyof T): number => {
    if (array.length > 1) {
      const res = array.reduce((p, v) =>
        Number(p[key]) < Number(v[key]) ? p : v
      );
      return Number(res[key]);
    } else if (array.length === 1) {
      return Number(array[0][key]);
    }
    return 0;
  },

  max: <T>(array: T[], key: keyof T): number => {
    if (array.length > 1) {
      const res = array.reduce((p, v) =>
        Number(p[key]) > Number(v[key]) ? p : v
      );
      return Number(res[key]);
    } else if (array.length === 1) {
      return Number(array[0][key]);
    }
    return 0;
  },

  take: <T>(array: T[], count: number): T[] => {
    return array.slice(0, count);
  },

  sortAsc: <T>(array: T[], key: keyof T): T[] => {
    return [...array].sort((a, b) => {
      const aVal = Number(a[key]);
      const bVal = Number(b[key]);
      if (aVal > bVal) return 1;
      if (aVal < bVal) return -1;
      return 0;
    });
  },

  sortDesc: <T>(array: T[], key: keyof T): T[] => {
    return [...array].sort((a, b) => {
      const aVal = Number(a[key]);
      const bVal = Number(b[key]);
      if (aVal > bVal) return -1;
      if (aVal < bVal) return 1;
      return 0;
    });
  },

  remove: <T>(array: T[], key: keyof T, match: any): boolean => {
    for (let index = 0; index < array.length; index++) {
      const current = array[index];
      if (current[key] === match) {
        array.splice(index, 1);
        return true;
      }
    }
    return false;
  },

  find: <T>(
    array: T[],
    predicate: (value: T, index: number, array: T[]) => boolean
  ): T | undefined => {
    return array.find(predicate);
  },
};
