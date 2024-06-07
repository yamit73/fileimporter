import { FileInterface, response } from "./interfaces/FileInterface";
import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import https from "https";
import pino from "pino";
import Log from "./Log";
import csv from "csv-parser";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

class File implements FileInterface {
  _filePath: string;
  _logger: pino.Logger;

  parentDirPath: string;
  _fileUrl =
    "https://fbuploadfiles.s3.us-east-2.amazonaws.com/408504410555913.csv";

  constructor(filePath?: string) {
    Log.setLogFile("csv.log");
    this._logger = Log.getInstance();
    this._filePath = filePath ?? path.join(__dirname, "..", "csvfiles");
    this.parentDirPath = path.dirname(this._filePath);
  }

  private loadFileContent(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!fs.existsSync(this._filePath)) {
        fs.mkdir(this._filePath, { recursive: true }, (err) => {
          if (err) {
            console.log(err);
            return reject(err);
          }
        });
      }
      const urlObj = new URL(this._fileUrl);
      const fileName: string = path.join(
        this._filePath,
        urlObj.pathname.split("/").pop() ?? ""
      );
      const csvFile = fs.createWriteStream(fileName);

      https
        .get(this._fileUrl, (res) => {
          res.pipe(csvFile);

          csvFile.on("finish", () => {
            csvFile.close((err) => {
              if (err) {
                console.log(err);
                return reject(err);
              }
              resolve("resolved!!");
            });
          });

          csvFile.on("error", (err) => {
            console.log(err);
            reject(err);
          });
        })
        .on("error", (err) => {
          console.log(err);
          reject(err);
        });
    });
  }

  async getData(req: Request, res: Response) {
    try {
      let { limit = 10, page = 0 } = req.query;
      // await this.loadFileContent();
      let result: any[] = [];
      limit = Number(limit);
      const skip: number = Number(page) * limit;
      let rowCount: number = 0;
      let headers: any = [];

      await new Promise<void>((resolve, reject) => {
        fs.createReadStream(this._filePath + "/1651048075420754.csv")
          .pipe(csv())
          .on("headers", (headerList) => {
            headers = headerList;
            this._logger.info(headers);
          })
          .on("data", (row) => {
            rowCount++;
            if (rowCount > skip && rowCount <= skip + limit) {
              result.push(row);
            }
          })
          .on("end", () => {
            console.log("finished reading csv !!!");
            resolve();
          })
          .on("error", (error) => {
            console.log("error occured");
            reject(error);
          });
      });
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, errors: [error.message] });
    }
  }

  private getCsvHeaders(headers: string[]) {
    let revHeader: any = {};
    headers.forEach((value, index) => {
      revHeader[value] = index;
    });
    return revHeader;
  }
}

export { File };
