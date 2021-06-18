import { Scheduler } from "../helpers/scheduler";
import { Scenes, Telegraf, Context } from "telegraf";
import { EParserType } from "../helpers/parser";

interface ToriWizard extends Scenes.WizardSessionData {
  ToriWizardSessionProp: number;
}

interface AddParserSession extends Scenes.WizardSession<ToriWizard> {
  name?: string;
  url?: string;
}

interface AddParserContext extends Context {
  myContextProp: string;
  session: AddParserSession;
  scene: Scenes.SceneContextScene<AddParserContext, ToriWizard>;
  wizard: Scenes.WizardContextWizard<AddParserContext>;
}

export const createAddParserWizard = (scheduler: Scheduler, bot: Telegraf) =>
  new Scenes.WizardScene<AddParserContext>(
    "add-parser",
    async (ctx) => {
      await ctx.reply(
        "Hi!\nI'm Toribot!\nI'll help you to find the best items first from tori.fi. Let's setup your first tori query.\nWhat would be the name for the query?"
      );
      return ctx.wizard.next();
    },
    async (ctx) => {
      const message = ctx.message as any;

      if (!message) {
        await ctx.reply("Invalid name, exiting..");
        return ctx.scene.leave();
      }

      ctx.session.name = message.text;
      await ctx.reply(
        "What would be the url of the tori.fi query you want me to keep you updated?"
      );
      return ctx.wizard.next();
    },
    async (ctx) => {
      const message = ctx.message as any;

      if (!message) {
        await ctx.reply("Invalid url, exiting..");
        return ctx.scene.leave();
      }

      ctx.session.url = message.text;
      await ctx.reply("Thanks! I'll create the parser now...");
      scheduler.addParser(
        {
          name: ctx.session.name,
          parserType: EParserType.Tori,
          url: ctx.session.url,
          intervalMinutes: 1,
        },
        async ({ parser, items }) => {
          for (const item of items) {
            await bot.telegram.sendMessage(
              ctx.chat.id,
              `${parser.name}:\n<b>${item.title}</b>\n<a href="${item.link}">${item.link}</a>\n${item.price}`,
              { parse_mode: "HTML" }
            );
          }
        }
      );
      await ctx.reply("Added!");
      return ctx.scene.leave();
    }
  );
