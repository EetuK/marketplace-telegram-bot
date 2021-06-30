import { logger } from "./log";

export interface IParseResult {
  id: string | number;
  title: string;
  price?: string;
  imageUrl?: string;
  link: string;
}

export enum EParserType {
  Tori = "tori",
}

export type OnNewItemsFound = (params: {
  parser: IUserSetParserInfo;
  items: IParseResult[];
}) => Promise<void>;

export type previousParseResults = (string | number)[];

export interface IUserSetParserInfo {
  name: string;
  parserType: EParserType;
  url: string;
  intervalMinutes: number;
}

export interface IParserInfo extends IUserSetParserInfo {
  id: number;
}

export interface IParserInfoWithPreviousResults extends IParserInfo {
  previousParseResults: previousParseResults;
}

export abstract class Parser {
  public info?: IParserInfo = undefined;

  constructor(params: IParserInfo) {
    this.info = params;
    logger.info("new parser created with info", this.info);
  }

  previousParseResults: previousParseResults = [];

  abstract fetchNewResults(
    onNewItemsFound: OnNewItemsFound
  ): Promise<IParseResult[]>;
}
