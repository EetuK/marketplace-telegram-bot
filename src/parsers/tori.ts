import { IParseResult, OnNewItemsFound, Parser } from "../helpers/parser";
import * as Xray from "x-ray";
import { logger } from "../helpers/log";

export class Tori extends Parser {
  async fetchNewResults(onNewItemsFound: OnNewItemsFound) {
    const xray = Xray({
      filters: {
        trim: function (value) {
          return typeof value === "string" ? value.trim() : value;
        },
      },
    });

    const xrayResult = await xray(this.info.url, ".item_row_flex", [
      {
        id: "@id",
        title: "div .li-title",
        link: "@href",
        price: ".list_price",
        date: ".date_image",
      },
    ]).limit(3);

    const products: IParseResult[] = xrayResult.map((product) => {
      const { title, link, price } = product;
      const id = product.id.split("_")[1];
      const ret = {
        id,
        title,
        price,
        link,
      };
      return ret;
    });

    if (this.previousParseResults.length === 0) {
      this.previousParseResults = products.map((p) => p.id);
    }

    // For testing
    // this.previousParseResults.splice(0, 1);

    const newProducts = products.filter(
      (p) => !this.previousParseResults.includes(p.id)
    );
    const newProductIds = newProducts.map((p) => p.id);

    logger.info(
      `[${this.info.parserType}]: ${this.info.name} queried with ${newProductIds.length} new products.`
    );

    this.previousParseResults.push(...newProductIds);

    await onNewItemsFound({ parser: this.info, items: newProducts });
    return newProducts;
  }
}
