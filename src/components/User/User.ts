import { IUser, UserModel } from "../../models/UserModel";
import { Password } from "./Password";
import { Token } from "./Token";

interface ApiResponse {
  success: boolean;
  errors?: string[];
  data?: any;
}

class User {
  userModel: UserModel;
  private _passwordObj: any;

  constructor() {
    this.userModel = new UserModel();
  }

  async signup(req: any, res: any) {
    let response: ApiResponse = {
      success: false,
      errors: [],
    };
    const rawBody = req.body ?? {};
    if (Object.keys(rawBody).length < 0) {
      response.errors!.push("No data found");
      return res.status(400).json(response);
    }
    const isValidParams = this.validateSignParams(rawBody);
    if (isValidParams.success) {
      const user = await this.userModel.getByEmail(rawBody.email);
      if (user) {
        response.errors?.push("User with same email already exists!!");
        return res.json(response);
      }
      const hashedPassword: string = await this._passwordObj.encrypt();
      const userCreateResp = await this.userModel.create({
        full_name: rawBody.full_name,
        email: rawBody.email,
        password: hashedPassword,
        phone_number: rawBody.phone,
      });
      const tokenPayload = {
        user_id: userCreateResp,
      };
      const toeknObj = new Token();
      const token = await toeknObj.generate(tokenPayload);
      res.status(200);
      response = {
        success: true,
        data: { user_id: userCreateResp, token: token },
      };
    } else {
      res.status(400);
      response = isValidParams;
    }
    return res.json(response);
  }

  async signin(req: any, res: any) {
    let response: ApiResponse = {
      success: false,
      errors: [],
    };
    const rawBody = req.body ?? {};
    if (Object.keys(rawBody).length < 1) {
      response.errors?.push("No data found!!");
      return res.status(400).json(response);
    }
    const validateUserResponse = this?.validateSignParams(rawBody);
    if (validateUserResponse.success) {
      const dbUser = await this.userModel.getByEmail(rawBody.email);
      if (dbUser === null) {
        response.errors?.push("User not found, kindly signup!!");
        return res.status(400).json(response);
      }
      const passwordMatched = await this._passwordObj
        .setPassword(rawBody.password)
        .match(dbUser?.password ?? "");
      if (!passwordMatched) {
        response.errors?.push("Invalid password!");
        return res.status(400).json(response);
      }
      const toeknObj = new Token();
      const userId = dbUser._id.toString();
      const token = await toeknObj.generate({ user_id: userId });
      res.status(200);
      response = {
        success: true,
        data: { user_id: userId, token: token },
      };
    } else {
      res.status(404);
      response = validateUserResponse;
    }
    return res.json(response);
  }

  getUser(req: any, res: any): ApiResponse {
    return res.json({ success: true, data: "Hello there! from getUser" });
  }

  deleteUser(req: any, res: any): ApiResponse {
    return res.json({ success: true, data: "Hello there! from deleteUser" });
  }

  private validateSignParams(rawBody: any): ApiResponse {
    let response: ApiResponse = {
      success: true,
      errors: [],
    };

    if (!rawBody?.email || !rawBody?.password) {
      response.success = false;
      response.errors?.push("email, password are required!!");
      return response;
    }
    this._passwordObj = new Password(rawBody.password);
    const isValidEmail: boolean = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      rawBody.email
    );
    const isValidPassword: boolean = this._passwordObj.validate();
    if (!isValidEmail) {
      response.success = false;
      response.errors?.push("Email is not valid!");
    }
    if (!isValidPassword) {
      response.success = false;
      response.errors?.push("Password is invalid!!");
    }
    return response;
  }
}

export default User;
