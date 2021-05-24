export type OutputType = {
  [key: string]: string[]
}

export type TCheckThresholdParams = {
  numbers: number[],
  base?: number
};

export type TCheckThreshold = (params: TCheckThresholdParams) => boolean;

export type TDetectorsMap = {
  [detectorType: string]: {
    checkThreshold: TCheckThreshold
  }
};

export type TBaseByDetectorType = {
  [type: string]: number
};

export type TOuputCalculation = {
  [detectorId: string]: {
    [detectorType: string]: [TCheckThreshold, number[], number]
  }
};

export type TBuildCalculationParams = {
  logs: RegExpMatchArray,
  bases: TBaseByDetectorType
};