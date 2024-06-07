import { Request, Response, NextFunction } from "express";
import MongoDb from "./MongoDb";

interface CustomRequest extends Request {
  db?: any;
}
class Middleware {
  async beforeHndleRequest(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) {
    const mongo: MongoDb = new MongoDb();
    req.db = await mongo.getDb();
    next();
  }
}

export default Middleware;
