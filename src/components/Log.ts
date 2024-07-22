import pino from "pino";
import fs, { existsSync } from "fs";
import path from "path";

class Log {
  private static loggerObj: null | pino.Logger;
  private static _dirPath: string = "/home/cedcoss/Node/filereader/var/logs/";

  public static setLogFile(file: string): void {
    if (!file) {
      throw new Error("File is required!");
    }
    const filePath: string = path.join(Log._dirPath, file);
    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    if (!existsSync(filePath)) {
      fs.writeFileSync(filePath, "");
    }
    Log.loggerObj = pino({}, pino.destination(file));
  }

  public static getInstance(): pino.Logger {
    if (!Log.loggerObj) {
      const defaultPath: string = Log._dirPath + "app.log";
      Log.loggerObj = pino({}, pino.destination(defaultPath));
    }
    return Log.loggerObj;
  }
}

export default Log;
