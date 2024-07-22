import { ObjectId, WithId } from "mongodb";
import { IBaseModel, BaseModel } from "./BaseModel";

interface IUser extends IBaseModel {
  email: string;
  password: string;
  username: string;
  full_name: string;
  role: string;
  user_id?: string;
  phone_number?: string;
}

class UserModel extends BaseModel<IUser> {
  protected collectionName: string = "users";

  async createUser(data: {
    [key: string]: any;
  }): Promise<boolean | ObjectId | string> {
    if (!this.collection) {
      await this.init();
    }
    try {
      const result = await this.create(data as Document);
      return result !== null ? result.toString() : false;
    } catch (error) {
      throw error;
    }
  }

  async getByEmail(email: string): Promise<WithId<IUser> | null> {
    if (!this.collection) {
      await this.init();
    }
    try {
      const user = await this.findFirst({ email: email });
      return user;
    } catch (error) {
      throw error;
    }
  }
}

export { UserModel, IUser };
