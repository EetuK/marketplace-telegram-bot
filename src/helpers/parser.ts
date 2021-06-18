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

export interface IUserSetParserInfo {
  name: string;
  parserType: EParserType;
  url: string;
  intervalMinutes: number;
}

export interface IParserInfo extends IUserSetParserInfo {
  id: number;
}

export abstract class Parser {
  public info?: IParserInfo = undefined;

  constructor(params: IParserInfo) {
    this.info = params;
    console.log("new parser created with info", this.info);
  }

  previousParseResults: (string | number)[] = [];

  abstract fetchNewResults(
    onNewItemsFound: OnNewItemsFound
  ): Promise<IParseResult[]>;
}
