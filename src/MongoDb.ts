import { MongoClient, Db, Collection } from "mongodb";

class MongoDb {
  uri: string;
  db: Db | null = null;

  constructor() {
    this.uri = this.prepareUri();
  }

  async connect(): Promise<void> {
    try {
      const client: MongoClient = new MongoClient(this.uri);
      await client.connect();
      this.db = client.db(process.env.DB_NAME);
    } catch (error) {
      console.log("Error connecting to DB!!", error);
    }
  }
  async getDb(): Promise<Db | null> {
    if (!this.db) {
      await this.connect();
    }
    return this.db;
  }

  async getCollection<T extends Document>(
    name: string
  ): Promise<Collection<T> | undefined> {
    if (!name) {
      throw new Error("name of collection is required!!");
    }
    if (!this.db) {
      await this.connect();
    }
    return this.db?.collection<T>(name);
  }

  private prepareUri(): string {
    return `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}`;
  }
}

export default MongoDb;
