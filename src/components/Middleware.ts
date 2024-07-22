import { Request, Response, NextFunction } from "express";
import { Token } from "./User/Token";

interface CustomRequest extends Request {
  user_id?: string;
}
class Middleware {
  allowedEndpoints: { [key: string]: boolean } = {
    "/user/signup": true,
    "/user/signin": true,
  };

  async beforeHandleRequest(
    request: CustomRequest,
    response: Response,
    next: NextFunction
  ) {
    try {
      const currentEndpoint: string = request.originalUrl || request.url;
      if (!this.allowedEndpoints[currentEndpoint]) {
        const token = this.getTokenFromRequest(request);
        const tokenObj = new Token();
        const tokenData = await tokenObj.validate(token);
        if (tokenData.user_id) {
          request.user_id = tokenData.user_id;
        }
      }
      next();
    } catch (error) {
      next(error);
    }
  }

  errorHandler(err: Error, req: any, res: any, next: NextFunction) {
    res.status(500).json({
      success: false,
      errors: [err.message ?? "Internal Server Error"],
    });
  }

  getTokenFromRequest(request: any): string {
    let token = request.query.token ?? "";
    if (token) {
      return token;
    }

    const header = request.headers["authorization"];
    if (header && header.startsWith("Bearer ")) {
      token = header.substring(7);
    }
    if (token) {
      return token;
    }
    throw new Error("Token is required!!");
  }
}

export default Middleware;
