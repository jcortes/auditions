import { createReadStream } from "fs";
import { REGEXP } from "./constants";
import { OutputType } from "./types";
import { buildBases, buildCalculation, buildOutput } from "./utils";

export const evaluate = async (_filename: string): Promise<OutputType> => {
  const stream = createReadStream(_filename);
  let data: string = '';

  return new Promise((resolve, reject) => {
    
    function onReadData(chunk: string | Buffer) {
      data += Buffer.from(chunk).toString();
    }

    function onReadError(e: Error) {
      return reject(e);
    }

    function onReadEnd() {
      const detectors = data.match(REGEXP.RAW_DETECTORS) || [];
      const logs = data.match(REGEXP.RAW_LOG_GROUPS) || [];
      
      const bases = buildBases(detectors);
      const calculation = buildCalculation({ logs, bases });
      const output = buildOutput(calculation);
      return resolve(output);
    }

    return stream
      .on("data", onReadData)
      .on("error", onReadError)
      .on("end", onReadEnd);
  });
}
