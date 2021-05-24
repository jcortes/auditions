import { createReadStream } from "fs";
import { REGEXP } from "./constants";
import { OutputType } from "./types";
import { buildBases, buildCalculation, buildOutput } from "./utils";

export const evaluate = async (_filename: string): Promise<OutputType> => {
  const stream = createReadStream(_filename);
  let output: OutputType;

  return new Promise((resolve, reject) => {
    
    function onData(data: string | Buffer) {
      const str = Buffer.from(data).toString();
      const detectors = str.match(REGEXP.RAW_DETECTORS) || [];
      const logs = str.match(REGEXP.RAW_LOG_GROUPS) || [];
      const bases = buildBases(detectors);
      const calculation = buildCalculation({ logs, bases });
      
      output = buildOutput(calculation);
      return output;
    }

    function onClose() {
      return resolve(output);
    }

    function onError(e: Error) {
      return reject(e);
    }

    return stream
      .on("data", onData)
      .on("close", onClose)
      .on("error", onError);
  });
}
