import { Scheduler } from "../helpers/scheduler";
import { Scenes, Telegraf, Context, Composer, Markup } from "telegraf";
import { EParserType } from "../helpers/parser";

const ALLOWED_INTERVALS = ["5", "10", "15", "30", "60"];
interface ToriWizard extends Scenes.WizardSessionData {
  ToriWizardSessionProp: number;
}

interface AddParserSession extends Scenes.WizardSession<ToriWizard> {
  name?: string;
  parserType?: EParserType;
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
        "Hi!\nI'm marketplace bot!\nI'll help you to find the best items first from the desired marketplace. Let's start the query setup. What type of a query you want to make?",
        Markup.keyboard([Markup.button.callback(EParserType.Tori, "")])
      );
      return ctx.wizard.next();
    },
    async (ctx) => {
      const message = ctx.message as any;

      if (!message || !Object.values(EParserType).includes(message.text)) {
        await ctx.reply("Invalid parser type, exiting..");
        return ctx.scene.leave();
      }

      ctx.session.parserType = message.text;

      await ctx.reply(
        "What would be the name of the query?",
        Markup.removeKeyboard()
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
        "What would be the url of the query you want me to keep you updated?"
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

      await ctx.reply(
        "Okay, what would be the interval of the query?",
        Markup.keyboard(
          ALLOWED_INTERVALS.map((interval) =>
            Markup.button.callback(interval, interval)
          )
        )
      );
      return ctx.wizard.next();
    },
    async (ctx) => {
      const message = ctx.message as any;

      if (
        !message ||
        !ALLOWED_INTERVALS.includes(message.text) ||
        !Number.isInteger(Number(message.text))
      ) {
        await ctx.reply("Invalid interval, exiting..");
        return ctx.scene.leave();
      }

      await ctx.reply("Thanks! I'll create the parser now...");
      scheduler.addParser(
        {
          name: ctx.session.name,
          parserType: ctx.session.parserType,
          url: ctx.session.url,
          intervalMinutes: message.text,
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
      await ctx.reply("Added!", Markup.removeKeyboard());
      return ctx.scene.leave();
    }
  );
