import { TDetectorsMap } from "./types";
import {
  checkBumpinessThreshold,
  checkHappinessThreshold,
  checkLoudnessThreshold,
  checkNoisinessThreshold
} from "./threshold";

export const REGEXP = {
  // Positive Lookahead to get only the header
  RAW_DETECTORS: /([a-zA-Z]+\s+\d+)(?=\s+|\n)/g,
  // Negative Lookbehind to get groups of logs by detector
  RAW_LOG_GROUPS: /(?<=^)(\w+\s+(\w+-)+\w+\n)((\d+-)+\w+:\d+\s\d+\n?)+/gm,
  // Groups between spaces like str.split(' ')
  RAW_BETWEEN_SPACES: /[^\s]+/g
};

export const DETECTORS: TDetectorsMap = {
  loudness: { checkThreshold: checkLoudnessThreshold },
  bumpiness: { checkThreshold: checkBumpinessThreshold },
  happiness: { checkThreshold: checkHappinessThreshold },
  noisiness: { checkThreshold: checkNoisinessThreshold }
};