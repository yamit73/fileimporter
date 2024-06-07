import { Request, Response } from "express";
import pino from "pino";
type response = {
  success: boolean;
  errors?: string[];
  data?: [];
};

interface FileInterface {
  _filePath: string;
  _logger: pino.Logger;

  getData(req: Request, res: Response):any;
}

export { FileInterface, response };
