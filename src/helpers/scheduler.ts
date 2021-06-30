import { Tori } from "../parsers/tori";
import { logger } from "./log";
import {
  Parser,
  IUserSetParserInfo,
  EParserType,
  OnNewItemsFound,
} from "./parser";

export interface IParserInterval {
  parser: Parser;
  intervalFunction: NodeJS.Timeout;
}

const minToMs = (minutes: number) => {
  return minutes * 60 * 1000;
};

export class Scheduler {
  private parsers: IParserInterval[] = [];

  constructor() {}

  private createParser(parserInfo: IUserSetParserInfo) {
    const maxId = Math.max(
      ...this.parsers.map((parser) => parser.parser.info.id),
      0
    );

    const fullParserInfo = {
      ...parserInfo,
      id: maxId + 1,
    };

    logger.info(
      `New ${
        EParserType[fullParserInfo.parserType]
      } parser created with info: `,
      fullParserInfo
    );

    if (parserInfo.parserType === EParserType.Tori) {
      return new Tori(fullParserInfo);
    }
  }

  public addParser(
    parserInfo: IUserSetParserInfo,
    onNewItemsFound: OnNewItemsFound
  ) {
    const parser = this.createParser(parserInfo);

    const intervalFunction = setInterval(
      async () => parser.fetchNewResults(onNewItemsFound),
      minToMs(parser.info.intervalMinutes)
    );
    this.parsers.push({
      parser,
      intervalFunction,
    });
    parser.fetchNewResults(onNewItemsFound);
  }

  public listParsers() {
    return this.parsers.map((parser) => {
      return parser.parser.info;
    });
  }

  public deleteParser(id: number) {
    const indexToDelete = this.parsers.findIndex(
      (parser) => parser.parser.info.id === id
    );
    if (indexToDelete < 0 || indexToDelete > this.parsers.length) {
      return;
    }
    this.parsers.splice(indexToDelete, 1);
  }
}
