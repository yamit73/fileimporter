import { Router } from "express";
import { RoutesInterface } from "../interfaces/RouterInterface";
import { File } from "./File";
import AttributeMapping from "./AttributeMapping";
import User from "./User/User";

class Routes implements RoutesInterface {
  private _router: Router;

  constructor() {
    this._router = Router();
  }
  public getRoutes(): Router {
    const userObj = new User();
    this._router.post("/user/signup", userObj.signup.bind(userObj));
    this._router.post("/user/signin", userObj.signin.bind(userObj));

    const file = new File();
    this._router.get("/file", file.getData.bind(file));

    const attrMapObj = new AttributeMapping();
    this._router.post(
      "/attributeMap",
      attrMapObj.mapAttribute.bind(attrMapObj)
    );
    this._router.get("/attributes", attrMapObj.getAttributes.bind(attrMapObj));
    return this._router;
  }
}

export { Routes };
