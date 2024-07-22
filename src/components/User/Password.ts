import bcrypt from "bcrypt";

class Password {
  password: string;

  constructor(password: string) {
    this.password = password;
  }

  async encrypt(): Promise<string> {
    try {
      const hashedPassword = await bcrypt.hash(this.password, 10);
      return hashedPassword;
    } catch (error) {
      throw error;
    }
  }

  async match(ncrypedPassword: string): Promise<boolean> {
    try {
      const mached = await bcrypt.compare(this.password, ncrypedPassword);
      return mached;
    } catch (error) {
      throw error;
    }
  }

  validate(): boolean {
    let valid = false;
    if (this.password.length < 8) {
      return valid;
    }
    let isLetter = false,
      isNumber = false,
      isSpecChars = false;

    for (let ch of this.password) {
      if (/[a-zA-Z]/.test(ch)) {
        isLetter = true;
      } else if (/^\d$/.test(ch)) {
        isNumber = true;
      } else if (/[!@#$%^&*(),.?":{}|<>]/.test(ch)) {
        isSpecChars = true;
      }
    }
    if (isLetter && isNumber && isSpecChars) {
      valid = true;
    }
    return valid;
  }

  getPassword(): string {
    return this.password;
  }

  setPassword(password: string) {
    this.password = password;
    return this;
  }
}

export { Password };
