import { object, string, pattern, assert } from "superstruct";
import * as dotenv from "dotenv";
import { logger } from "./log";

interface IConfiguration {
  TOKEN: string;
  ALLOWED_CHAT_IDS: number[];
}

const Configuration = object({
  TOKEN: string(),
  ALLOWED_CHAT_IDS: pattern(string(), /^\d+(,\d+)*$/),
});

class Config {
  private config?: IConfiguration;

  public init = () => {
    dotenv.config({ path: `${__dirname}/../../.env` });

    try {
      const env = {
        TOKEN: process.env.TOKEN,
        ALLOWED_CHAT_IDS: process.env.ALLOWED_CHAT_IDS,
      };
      assert(env, Configuration);

      this.config = {
        ...env,
        ALLOWED_CHAT_IDS: env.ALLOWED_CHAT_IDS.split(",").map((value) =>
          Number(value)
        ),
      };
    } catch (err) {
      const { branch, ...others } = err;
      logger.error(others);
      this.config = undefined;
    }
  };

  public getConfig = () => {
    if (!this.config) {
      throw Error(
        "Error with app configuration. Check your environment variables!"
      );
    }
    return this.config;
  };
}

export const config = new Config();
