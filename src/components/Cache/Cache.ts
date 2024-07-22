import { createClient, RedisClientType } from "redis";
interface IRedis {
  get(key: string): Promise<string | null | any[]>;
  set(
    key: string,
    value: any,
    ttl: number | null,
    group: string
  ): Promise<boolean>;
}

class RCache implements IRedis {
  private static client: RedisClientType | null = null;

  constructor() {
    if (RCache.client === null) {
      this.connect();
    }
  }
  async get(key: string): Promise<string | null | any[]> {
    if (RCache.client === null) {
      await this.connect();
    }
    throw new Error("Method not implemented.");
  }
  async set(
    key: string,
    value: any,
    ttl: number | null,
    group: string = "default"
  ): Promise<boolean> {
    if (RCache.client === null) {
      await this.connect();
    }
    throw new Error("Method not implemented.");
  }

  async connect() {
    try {
      if (RCache.client === null) {
        const port = Number(process.env.REDIS_PORT) || 6379;
        const host = process.env.REDIS_HOST || "127.0.0.1";
        const password = process.env.REDIS_PASSWORD || undefined;
        RCache.client = createClient({
          socket: {
            host,
            port,
          },
          password,
        });
        RCache.client.on("error", (error) => {
          throw error;
        });
        await RCache.client.connect();
      }
      return RCache.client;
    } catch (error) {
      throw error;
    }
  }
}

export { RCache };
