import { DETECTORS, REGEXP } from "./constants";
import { OutputType, TBaseByDetectorType, TBuildCalculationParams, TOuputCalculation } from "./types";

export function buildBases(detectors: RegExpMatchArray) {
  const bases =
    detectors.reduce<TBaseByDetectorType>((reduction, detector) => {
      const [detectorType, base] = detector.match(REGEXP.RAW_BETWEEN_SPACES) || [];
      return { ...reduction, [detectorType]: parseInt(base.trim(), 10) };
    }, {});
  return bases;
}

export function buildCalculation({ logs, bases }: TBuildCalculationParams) {
  const outputCalculation =
    logs.reduce<TOuputCalculation>((reduction, log) => {
      const [detectorInfo, ...logs] = log.split("\n");
      const [detectorTypeRaw, detectorIdRaw] = detectorInfo.match(REGEXP.RAW_BETWEEN_SPACES) || [];
      const detectorType = detectorTypeRaw.trim();
      const detectorId = detectorIdRaw.trim();
      const detector = DETECTORS[detectorType];

      if (!detector) {
        return reduction;
      }

      const { checkThreshold } = detector;
      const base = bases[detectorType];

      const numbers = logs.reduce<number[]>((reduction, log) => {
        if (!log) {
          return reduction;
        }
        const [, valueStr] = log.match(REGEXP.RAW_BETWEEN_SPACES) || [];
        const num = parseInt(valueStr, 10);
        return [...reduction, num];
      }, []);

      const { [detectorId]: currentDetector, ...otherDetectors } = reduction;
      if(!currentDetector) {
        return {
          ...reduction,
          [detectorId]: {
            [detectorType]: [checkThreshold, numbers, base]
          }
        };
      }

      const { [detectorType]: currentDetectorType, ...otherDetectorTypes } = currentDetector;
      if (!currentDetectorType) {
        return {
          ...otherDetectors,
          [detectorId]: {
            ...otherDetectorTypes,
            [detectorType]: [checkThreshold, numbers, base]
          }
        };
      }

      const [currentCheckThreshold, currentNumbers, currentBase] = currentDetectorType;
      return {
        ...otherDetectors,
        [detectorId]: {
          ...otherDetectorTypes,
          [detectorType]: [currentCheckThreshold, [...currentNumbers, ...numbers], currentBase]
        }
      }
    }, {});

  return outputCalculation;
}

export function buildOutput(outputCalculation: TOuputCalculation) {
  const output = Object.keys(outputCalculation)
    .reduce<OutputType>((reduction, detectorId) => {
      const detectorTypes =
        Object.keys(outputCalculation[detectorId])
          .filter(detectorType => {
            const [checkThreshold, numbers, base] = outputCalculation[detectorId][detectorType];
            const exceedsThreshold = checkThreshold({ numbers, base });
            return exceedsThreshold;
          });
      return {
        ...reduction,
        [detectorId]: detectorTypes
      };
  }, {});

  return output;
}