import Jwt, { JwtPayload } from "jsonwebtoken";
import fs from "fs/promises";

class Token {
  passphrase: string = "amit";

  async generate(payload: {}) {
    try {
      if (!payload) {
        throw new Error("Payload is required!");
      }
      const privateKey = await this.loadPrivateKey();
      const token = Jwt.sign(
        payload,
        { key: privateKey, passphrase: this.passphrase },
        {
          algorithm: "RS256",
          expiresIn: "1h",
        }
      );
      return token;
    } catch (error) {
      throw error;
    }
  }

  async validate(token: string): Promise<any> {
    try {
      const publicKey = await this.loadPublicKey();
      const tokenData = Jwt.verify(token, publicKey);
      return tokenData;
    } catch (error) {
      throw error;
    }
  }

  private async loadPrivateKey(): Promise<string> {
    const key = await fs.readFile(
      "/home/cedcoss/Node/filereader/security/private.pem"
    );
    return key.toString();
  }
  private async loadPublicKey(): Promise<string> {
    const key = await fs.readFile(
      "/home/cedcoss/Node/filereader/security/public.pem"
    );
    return key.toString();
  }
}

export { Token };
