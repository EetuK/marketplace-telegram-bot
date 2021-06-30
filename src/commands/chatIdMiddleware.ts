import { config } from "../helpers/configuration";
import { logger } from "../helpers/log";
import { Context, MiddlewareFn, TelegramError } from "telegraf";

export const chatIdMiddleware: MiddlewareFn<Context> = async (ctx, next) => {
  if (!config.getConfig().ALLOWED_CHAT_IDS.includes(ctx.chat.id)) {
    logger.error(`Chat id ${ctx.chat.id} not in the allowed chat id list.`);
    await ctx.reply("You don't have access. Go away.");
    throw new Error("unauthorized");
  }
  next();
};
