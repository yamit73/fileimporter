import {
  AnyBulkWriteOperation,
  Collection,
  ObjectId,
  OptionalUnlessRequiredId,
  WithId,
} from "mongodb";
import MongoDb from "../MongoDb";

interface IBaseModel extends Document {
  _id?: ObjectId;
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

  async update(
    query: Partial<any>,
    data: OptionalUnlessRequiredId<T>
  ): Promise<boolean> {
    try {
      if (!this.collection) {
        throw new Error("Call init first!!");
      }
      const result = await this.collection.updateOne(query, data);
      return result.modifiedCount > 0;
    } catch (error) {
      throw error;
    }
  }

  async delete(query: Partial<any>): Promise<boolean | number> {
    try {
      if (!this.collection) {
        throw new Error("Call init first!!");
      }
      const result = await this.collection.deleteOne(query);
      return result.deletedCount > 0;
    } catch (error) {
      throw error;
    }
  }

  async findFirst(query: Partial<any>): Promise<WithId<T> | null> {
    try {
      if (!this.collection) {
        throw new Error("Call init first!!");
      }
      const result = await this.collection.findOne(query);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async bulkWrite(query: AnyBulkWriteOperation<any>[]): Promise<any> {
    try {
      if (!this.collection) {
        throw new Error("Call init first!!");
      }
      const result = await this.collection.bulkWrite(query);
      return {
        matched_count: result.matchedCount,
        update_count: result.modifiedCount,
        upserted_count: result.upsertedCount,
        deleted_count: result.deletedCount,
      };
    } catch (error) {
      throw error;
    }
  }
}

export { IBaseModel, BaseModel };
