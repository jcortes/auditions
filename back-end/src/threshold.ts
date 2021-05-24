import { getAverage, getStandardDeviation, getSum } from "./standard-deviation";
import { TCheckThresholdParams } from "./types";

export function checkLoudnessThreshold({ numbers }: TCheckThresholdParams) {
  const sd = getStandardDeviation(numbers);
  return sd < 2;
}

export function checkBumpinessThreshold({ numbers, base = 1 }: TCheckThresholdParams) {
  const average = getAverage(numbers);
  return average > (1.5 * base);
}

export function checkHappinessThreshold({ numbers, base = 1 }: TCheckThresholdParams) {
  const sum = getSum(numbers);
  return sum > (1.2 * base);
}

export function checkNoisinessThreshold(_: TCheckThresholdParams) {
  return false;
}
