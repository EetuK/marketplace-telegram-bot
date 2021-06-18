import { Scheduler } from "../helpers/scheduler";
import { Scenes, Telegraf, Context, Markup, Composer } from "telegraf";

interface ToriWizard extends Scenes.WizardSessionData {
  ToriWizardSessionProp: number;
}

interface MySession extends Scenes.WizardSession<ToriWizard> {
  idToBeDeleted?: number;
}

interface MyContext extends Context {
  myContextProp: string;
  session: MySession;
  scene: Scenes.SceneContextScene<MyContext, ToriWizard>;
  wizard: Scenes.WizardContextWizard<MyContext>;
}

const stepHandler = new Composer<MyContext>();
stepHandler.action("delete", async (ctx) => {
  await ctx.reply("What is number of the query you want to delete?");
  return ctx.wizard.next();
});

export const createEditParsersWizard = (scheduler: Scheduler, bot: Telegraf) =>
  new Scenes.WizardScene<MyContext>(
    "list-parsers",
    async (ctx) => {
      const content = [
        "Here are all of your tori queries:",
        scheduler.listParsers().map(({ id, name, intervalMinutes }) => {
          return `<b>${id}.</b> ${name} (${intervalMinutes} min intervals)`;
        }),
      ];
      await ctx.reply(content.join("\n"), { parse_mode: "HTML" });
      await ctx.reply(
        "Do you want to delete one?",
        Markup.inlineKeyboard([
          Markup.button.callback("Yep", "delete"),
          Markup.button.callback("Noup", "cancel"),
        ])
      );
      return ctx.wizard.next();
    },
    stepHandler,
    async (ctx) => {
      const message = ctx.message as any;

      if (!message) {
        await ctx.reply("Invalid number, exiting..");
        return ctx.scene.leave();
      }
      let number;

      try {
        number = Number(message.text);
      } catch (err) {
        await ctx.reply("Invalid number, exiting..");
        return ctx.scene.leave();
      }

      scheduler.deleteParser(number);

      await ctx.reply("Deleted!");
      return ctx.scene.leave();
    }
  );
