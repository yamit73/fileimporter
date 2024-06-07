import { Collection, ObjectId, OptionalUnlessRequiredId } from "mongodb";
import MongoDb from "../MongoDb";

interface IBaseModel extends Document {
  _id: ObjectId;
}
class BaseModel<T extends IBaseModel> {
  protected collection?: Collection<T>;
  protected collectionName: string = "";

  async init() {
    const connection = new MongoDb();
    this.collection = await connection.getCollection<T>(this.collectionName);
  }

  async create(data: OptionalUnlessRequiredId<T>): Promise<ObjectId | null> {
    if (!this.collection) {
      throw new Error("Call init first!!");
    }
    try {
      const result = await this.collection.insertOne(data);
      return result.insertedId;
    } catch (error) {
      throw error;
    }
  }
}

export { IBaseModel, BaseModel };
