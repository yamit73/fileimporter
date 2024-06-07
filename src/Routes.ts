import { Router } from "express";
import { RoutesInterface } from "./interfaces/RouterInterface";
import { File } from "./File";

class Routes implements RoutesInterface {
  private _router: Router;

  constructor() {
    this._router = Router();
  }
  public getRoutes(): Router {
    const file = new File();
    this._router.get("/file", file.getData.bind(file));
    return this._router;
  }
}

export { Routes };
