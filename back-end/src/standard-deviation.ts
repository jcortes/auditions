// Extracted from https://dustinpfister.github.io/2018/02/20/statistics-standard-deviation/
export function getSum(numbers: number[]) {
  return numbers.reduce((a, b) => Number(a) + Number(b));
}

export function getAverage(numbers: number[]) {
  const sum = getSum(numbers);
  return sum / numbers.length;
}

export function getStandardDeviation(numbers: number[]) {
  const average = getAverage(numbers);
  const powerSum = numbers.reduce((reduction, nextNumber) => {
    return reduction + Math.pow(nextNumber - average, 2);
  }, 0);
  return Math.sqrt(powerSum / (numbers.length - 1))
}